import type { UnknownObject } from '@pk/types/helpers.js';
import pg, { type PoolClient } from 'pg';
import type { BaseRepository, FindManyOptions, FindOptions } from '../../types/repository.ts';
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

          acc.push(`${this.#getAttributeName(attributeDefinition)} AS ${escapeIdentifier(objectProperty)}`);

          return acc;
        }, [])
        .join(', ');

    const primaryKeyName = (primaryKey as string) ?? 'uid';

    this.#attributesDefinition = attributesDefinition;
    this.primaryKey = primaryKeyName;
    this.#primaryKeyIdentifier = escapeIdentifier(attributesDefinition[primaryKeyName] as string);
    this.table = table;
    this.#tableIdentifier = escapeIdentifier(table);
  }

  async delete(uidOrObject: string | Partial<T>, tx?: PoolClient): Promise<boolean> {
    const uid = typeof uidOrObject === 'string' ? uidOrObject : uidOrObject[this.primaryKey];

    if (!uid) {
      throw new Error(`Cannot delete ${this.#tableIdentifier} without ${this.#primaryKeyIdentifier}`);
    }

    const { success } = await Client.instance.queryRow<{ success: boolean }>({
      queryTextOrConfig: {
        name: `delete-${this.table}`,
        text: `DELETE
               FROM ${this.#tableIdentifier}
               WHERE ${this.#primaryKeyIdentifier} = $1
               RETURNING true AS success`,
        values: [uid],
      },
      resource: this.table,
      tx,
      uid: (uid as string) ?? 'unknown-uid',
    });

    return success;
  }

  find(object: Partial<T>, options?: FindManyOptions<T, PoolClient>): Promise<T[]> {
    const attributes = this.#selectAttributes(options?.attributes);
    const limit = escapeLiteral(options?.limit?.toString() ?? '10');
    const offset = escapeLiteral(options?.offset?.toString() ?? '0');
    const orderBy = options?.orderBy ? escapeIdentifier(options.orderBy as string) : this.#primaryKeyIdentifier;

    const conditions = this.#where(object);
    const where = conditions ? `WHERE ${conditions}` : '';

    return Client.instance.queryRows<T>({
      queryTextOrConfig: {
        name: `find-${this.table}`,
        text: `SELECT ${attributes}
               FROM ${this.#tableIdentifier} ${where}
               ORDER BY ${orderBy}
               LIMIT ${limit} OFFSET ${offset}`,
        values: Object.values(object),
      },
      tx: options?.tx,
    });
  }

  findOne(uidOrObject: string | Partial<T>, options?: FindOptions<T, PoolClient>): Promise<T> {
    const attributes = this.#selectAttributes(options?.attributes);
    const uid = typeof uidOrObject === 'string' ? uidOrObject : uidOrObject[this.primaryKey];

    return Client.instance.queryRow<T>({
      queryTextOrConfig: {
        name: `find-one-${this.table}`,
        text: `SELECT ${attributes}
               FROM ${this.#tableIdentifier}
               WHERE ${this.#primaryKeyIdentifier} = $1
                         LIKE 1`,
        values: [uid],
      },
      resource: this.table,
      tx: options?.tx,
      uid: (uid ?? 'unknown-uid') as string,
    });
  }

  async create(object: Partial<T>, tx?: PoolClient): Promise<T> {
    const attributes: string[] = [];
    const values: unknown[] = [];

    for (const key in object) {
      attributes.push(this.#getAttributeName(this.#attributesDefinition[key]));
      values.push(object[key]);
    }

    const cols = attributes.join(', ');
    const parameters = values.map((_, index) => `$${index + 1}`).join(',');

    return await Client.instance.queryRow<T>({
      queryTextOrConfig: {
        name: `insert-${this.#tableIdentifier}`,
        text: `INSERT INTO ${this.#tableIdentifier} (${cols})
               VALUES (${parameters})
               RETURNING ${this.#allAttributes}`,
        values,
      },
      resource: this.table,
      tx,
      uid: (object.uid ?? 'unknown-uid') as string,
    });
  }

  async update(object: Partial<T>, newObject: Partial<T>, tx?: PoolClient): Promise<T> {
    const attributesAndParameters: string[] = [];
    const values: unknown[] = [];

    for (const key in newObject) {
      attributesAndParameters.push(
          `${this.#getAttributeName(this.#attributesDefinition[key])} = $${attributesAndParameters.length + 1}`,
      );
      values.push(newObject[key]);
    }

    const set = attributesAndParameters.join(', ');
    const conditions = this.#where(object, attributesAndParameters.length);
    const where = conditions ? `WHERE ${conditions}` : '';

    return await Client.instance.queryRow<T>({
      queryTextOrConfig: {
        name: `update-${this.#tableIdentifier}`,
        text: `UPDATE ${this.#tableIdentifier}
               SET ${set} ${where}
               RETURNING ${this.#allAttributes}`,
        values: [...values, ...Object.values(object)],
      },
      resource: this.table,
      tx,
      uid: (object.uid ?? 'unknown-uid') as string,
    });
  }

  #getAttributeName(attribute: string | AttributeDefinition<T>) {
    return escapeIdentifier(typeof attribute === 'string' ? attribute : (attribute.name as string));
  }

  #selectAttributes(attributes: (keyof T)[] | undefined) {
    if (!attributes) {
      return this.#allAttributes;
    }

    return attributes;
  }

  #where(object: Partial<T>, offset = 0) {
    const where: string[] = [];

    for (const key in object) {
      where.push(`${this.#attributesDefinition[key]} = $${where.length + 1 + offset}`);
    }

    return where.join(' AND ');
  }
}
