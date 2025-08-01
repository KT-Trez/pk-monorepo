import type { DeepPartial, UnknownObject } from '@pk/types/helpers.js';
import pg, { type PoolClient } from 'pg';
import type { BaseRepository, FindManyOptions, FindOptions, QueryExpression } from '../../types/repository.ts';
import { ServerError } from '../response/ServerError.ts';
import { DatabaseService } from './DatabaseService.ts';

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

  async delete(primaryKeyOrQuery: string | QueryExpression<T>, tx?: PoolClient): Promise<boolean> {
    const conditions = this.#where(primaryKeyOrQuery);
    const where = conditions ? conditions : '1 = 1';

    const result = await DatabaseService.instance.queryRow<{ success: boolean }>({
      queryTextOrConfig: {
        text: `DELETE
               FROM ${this.#tableIdentifier}
               WHERE ${where}
               RETURNING true AS success`,
      },
      tx,
    });

    return result?.success ?? false;
  }

  find(query: QueryExpression<T>, options?: FindManyOptions<T, PoolClient>): Promise<T[]> {
    const attributes = this.#selectAttributes(options?.attributes);
    const limit = escapeLiteral(options?.limit?.toString() ?? '100');
    const offset = escapeLiteral(options?.offset?.toString() ?? '0');
    const orderByAttribute = options?.orderBy ? options.orderBy : this.primaryKey;
    const orderByAttributes = Array.isArray(orderByAttribute) ? orderByAttribute : [orderByAttribute];
    const orderBy = orderByAttributes.map(attribute => this.getAttributeName_new(attribute)).join(', ');

    const conditions = this.#where(query);
    const where = conditions ? conditions : '1 = 1';

    return DatabaseService.instance.queryRows<T>({
      queryTextOrConfig: {
        text: `SELECT ${attributes}
               FROM ${this.#tableIdentifier}
               WHERE ${where}
               ORDER BY ${orderBy}
               LIMIT ${limit} OFFSET ${offset}`,
      },
      tx: options?.tx,
    });
  }

  findOne(
    primaryKeyOrQuery: string | QueryExpression<T>,
    options?: FindOptions<T, PoolClient>,
  ): Promise<T | undefined> {
    const attributes = this.#selectAttributes(options?.attributes);
    const conditions = this.#where(primaryKeyOrQuery);

    return DatabaseService.instance.queryRow<T>({
      queryTextOrConfig: {
        text: `SELECT ${attributes}
               FROM ${this.#tableIdentifier}
               WHERE ${conditions}
               LIMIT 1`,
      },
      tx: options?.tx,
    });
  }

  async findOneOrCreate(primaryKeyOrQuery: string | QueryExpression<T>, object: DeepPartial<T>, tx?: PoolClient) {
    const foundObject = await this.findOne(primaryKeyOrQuery, { tx });

    if (foundObject) {
      return foundObject;
    }

    return this.create(object, tx);
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

    const row = await DatabaseService.instance.queryRow<T>({
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
    primaryKeyOrQuery: string | QueryExpression<T>,
    newObject: DeepPartial<T>,
    tx?: PoolClient,
  ): Promise<T | undefined> {
    const attributes: string[] = [];
    const values: unknown[] = [];

    for (const key in newObject) {
      const value = newObject[key];
      if (value === null || value === undefined) {
        attributes.push(`${this.getAttributeName_new(key)} = NULL`);
      } else if (value instanceof Buffer) {
        attributes.push(`${this.getAttributeName_new(key)} = $${values.length + 1}`);
        values.push(value);
      } else if (typeof value === 'string') {
        attributes.push(`${this.getAttributeName_new(key)} = ${escapeLiteral(value)}`);
      } else {
        attributes.push(`${this.getAttributeName_new(key)} = ${escapeLiteral(JSON.stringify(value))}`);
      }
    }

    const set = attributes.join(', ');
    const conditions = this.#where(primaryKeyOrQuery);
    const where = conditions ? conditions : '1 = 1';

    return await DatabaseService.instance.queryRow<T>({
      queryTextOrConfig: {
        text: `UPDATE ${this.#tableIdentifier}
               SET ${set}
               WHERE ${where}
               RETURNING ${this.#allAttributes}`,
        values,
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

  #where(primaryKeyOrQuery: string | QueryExpression<T>) {
    const isPrimaryKeyCondition = typeof primaryKeyOrQuery === 'string';

    if (isPrimaryKeyCondition) {
      return `${this.#primaryKeyIdentifier} = ${escapeLiteral(primaryKeyOrQuery)}`;
    }

    const where: string[] = [];

    for (const key in primaryKeyOrQuery) {
      const value = primaryKeyOrQuery[key];

      const isINOperator = key.endsWith('__in') && Array.isArray(value);

      if (isINOperator) {
        if (value.length === 0) {
          continue;
        }

        const originalKey = key.slice(0, -4);
        const escapedAttribute = this.getAttributeName_new(originalKey);
        const escapedValues = value.map(data => escapeLiteral(data)).join(', ');

        where.push(`${escapedAttribute} IN (${escapedValues})`);
      } else if (value !== undefined) {
        const escapedAttribute = this.getAttributeName_new(key);
        const escapedValue = escapeLiteral(value as string);

        where.push(`${escapedAttribute} = ${escapedValue}`);
      }
    }

    return where.join(' AND ');
  }
}
