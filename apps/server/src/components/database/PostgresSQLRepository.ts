import type { DeepPartial, UnknownObject } from '@pk/types/helpers.js';
import pg, { type PoolClient } from 'pg';
import type { BaseRepository, FindManyOptions, FindOptions } from '../../types/repository.ts';
import { ServerError } from '../response/ServerError.ts';
import { Client } from './Client.ts';

const { escapeIdentifier, escapeLiteral } = pg;

export type AttributeDefinition<T extends Record<string, unknown>> = {
  isHidden?: boolean;
  name: keyof T;
};

type PostgresSQLRepositoryOptions<T extends UnknownObject> = {
  attributesDefinition: Record<keyof T, string | AttributeDefinition<T>>;
  primaryKey?: keyof T;
  table: string;
};

export class PostgresSQLRepository<T extends UnknownObject> implements BaseRepository<T, PoolClient> {
  readonly primaryKey: string;
  readonly table: string;
  readonly #allAttributes: string;
  readonly #attributesDefinition: Record<keyof T, string | AttributeDefinition<T>>;
  readonly #primaryKeyIdentifier: string;
  readonly #tableIdentifier: string;

  constructor({ attributesDefinition, primaryKey, table }: PostgresSQLRepositoryOptions<T>) {
    this.#allAttributes = Object.entries(attributesDefinition)
      .reduce<string[]>((acc, [objectProperty, attributeDefinition]) => {
        if (typeof attributeDefinition === 'object' && attributeDefinition.isHidden) {
          return acc;
        }

        acc.push(`${this.#getAttributeName_old(attributeDefinition)} AS ${escapeIdentifier(objectProperty)}`);

        return acc;
      }, [])
      .join(', ');

    const primaryKeyName = (primaryKey as string) ?? 'uid';

    this.#attributesDefinition = attributesDefinition;
    this.primaryKey = primaryKeyName;
    this.#primaryKeyIdentifier = escapeIdentifier(attributesDefinition[primaryKeyName] as string);
    this.table = table;
    this.#tableIdentifier = table.split('.').map(escapeIdentifier).join('.');
  }

  async delete(primaryKeyOrQuery: string | Partial<T>, tx?: PoolClient): Promise<boolean> {
    const conditions = this.#where(primaryKeyOrQuery);

    const result = await Client.instance.queryRow<{ success: boolean }>({
      queryTextOrConfig: {
        text: `DELETE
               FROM ${this.#tableIdentifier}
               WHERE ${conditions}
               RETURNING true AS success`,
      },
      tx,
    });

    return result?.success ?? false;
  }

  find(query: Partial<T>, options?: FindManyOptions<T, PoolClient>): Promise<T[]> {
    const attributes = this.#selectAttributes(options?.attributes);
    const limit = escapeLiteral(options?.limit?.toString() ?? '10');
    const offset = escapeLiteral(options?.offset?.toString() ?? '0');
    const orderBy = options?.orderBy ? this.getAttributeName_new(options.orderBy) : this.#primaryKeyIdentifier;

    const conditions = this.#where(query);
    const where = conditions ? conditions : '1 = 1';

    return Client.instance.queryRows<T>({
      queryTextOrConfig: {
        name: `find-${this.table}-${conditions}`.substring(0, 63),
        text: `SELECT ${attributes}
               FROM ${this.#tableIdentifier}
               WHERE ${where}
               ORDER BY ${orderBy}
               LIMIT ${limit} OFFSET ${offset}`,
      },
      tx: options?.tx,
    });
  }

  findOne(primaryKeyOrQuery: string | Partial<T>, options?: FindOptions<T, PoolClient>): Promise<T | undefined> {
    const attributes = this.#selectAttributes(options?.attributes);
    const conditions = this.#where(primaryKeyOrQuery);

    return Client.instance.queryRow<T>({
      queryTextOrConfig: {
        name: `find-one-${this.table}-${conditions}`.substring(0, 63),
        text: `SELECT ${attributes}
               FROM ${this.#tableIdentifier}
               WHERE ${conditions}
               LIMIT 1`,
      },
      tx: options?.tx,
    });
  }

  async create(object: DeepPartial<T>, tx?: PoolClient): Promise<T> {
    const attributes: string[] = [];
    const values: unknown[] = [];

    for (const key in object) {
      attributes.push(this.getAttributeName_new(key));
      values.push(object[key]);
    }

    const into = attributes.join(', ');
    const parameters = values.map((_, index) => `$${index + 1}`).join(',');

    const row = await Client.instance.queryRow<T>({
      queryTextOrConfig: {
        text: `INSERT INTO ${this.#tableIdentifier} (${into})
               VALUES (${parameters})
               RETURNING ${this.#allAttributes}`,
        values,
      },
      tx,
    });

    if (!row) {
      throw new ServerError({ cause: `INSERT failed for object: "${JSON.stringify(object)}"` });
    }

    return row;
  }

  async update(
    primaryKeyOrQuery: string | Partial<T>,
    newObject: DeepPartial<T>,
    tx?: PoolClient,
  ): Promise<T | undefined> {
    const attributes: string[] = [];

    for (const key in newObject) {
      const value = newObject[key];
      if (value === null || value === undefined) {
        attributes.push(`${this.getAttributeName_new(key)} = NULL`);
      } else if (typeof value === 'string') {
        attributes.push(`${this.getAttributeName_new(key)} = ${escapeLiteral(value)}`);
      } else {
        attributes.push(`${this.getAttributeName_new(key)} = ${escapeLiteral(JSON.stringify(value))}`);
      }
    }

    const set = attributes.join(', ');
    const conditions = this.#where(primaryKeyOrQuery);
    const where = conditions ? conditions : '1 = 1';

    return await Client.instance.queryRow<T>({
      queryTextOrConfig: {
        text: `UPDATE ${this.#tableIdentifier}
               SET ${set}
               WHERE ${where}
               RETURNING ${this.#allAttributes}`,
      },
      tx,
    });
  }

  /**
   * Retrieves the attribute name based on the provided input.
   * If the input is a string, it escapes and returns the string.
   * If the input is an AttributeDefinition, it retrieves, escapes, and returns the name property.
   *
   * @param attribute - The attribute to process.
   * Can be a string representing the attribute name, or an object with a `name` property.
   * @return The escaped attribute name.
   *
   * @deprecated Use {@link PostgresSQLRepository.getAttributeName_new } instead.
   */
  #getAttributeName_old(attribute: string | AttributeDefinition<T>) {
    return escapeIdentifier(typeof attribute === 'string' ? attribute : (attribute.name as string));
  }

  private getAttributeName_new(attribute: keyof T | AttributeDefinition<T>) {
    if (typeof attribute === 'object') {
      return escapeIdentifier(attribute.name as string);
    }

    const attributeDefinition = this.#attributesDefinition[attribute];
    const attributeName = typeof attributeDefinition === 'string' ? attributeDefinition : attributeDefinition.name;

    return escapeIdentifier(attributeName as string);
  }

  #selectAttributes(attributes: (keyof T)[] | undefined) {
    if (!attributes) {
      return this.#allAttributes;
    }

    return attributes.map(this.getAttributeName_new).join(', ');
  }

  #where(primaryKeyOrQuery: string | Partial<T>) {
    const isPrimaryKeyCondition = typeof primaryKeyOrQuery === 'string';

    if (isPrimaryKeyCondition) {
      return `${this.#primaryKeyIdentifier} = ${escapeLiteral(primaryKeyOrQuery)}`;
    }

    const where: string[] = [];

    for (const key in primaryKeyOrQuery) {
      const escapedAttribute = this.getAttributeName_new(key);
      const escapedValue = escapeLiteral(primaryKeyOrQuery[key] as string);

      where.push(`${escapedAttribute} = ${escapedValue}`);
    }

    return where.join(' AND ');
  }
}
