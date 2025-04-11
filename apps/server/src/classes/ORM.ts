import type { StringKey, UnknownObject } from '@pk/types/helpers.js';
import pg, { type QueryResult } from 'pg';
import type { QueryFunction } from '../types/database.ts';
import type { DeleteOptions, IORM, InsertOptions, SelectOptions, UpdateOptions } from '../types/orm.js';

const { escapeLiteral, escapeIdentifier } = pg;

type ModelInfo = {
  attributes: string[];
  primaryKey: string;
};

export class ORM<Models extends string[]> implements IORM<Models> {
  #models: Map<Models[number], ModelInfo>;
  readonly #query: QueryFunction;

  constructor(query: QueryFunction) {
    this.#models = new Map();
    this.#query = query;
  }

  define<DbModel extends UnknownObject>(
    name: Models[number],
    attributes: StringKey<DbModel>[],
    primaryKey: StringKey<DbModel>,
  ) {
    this.#models.set(name, { attributes, primaryKey });
  }

  delete<DbModel extends UnknownObject>(
    name: Models[number],
    options: DeleteOptions<UnknownObject>,
  ): Promise<QueryResult<DbModel>> {
    const primaryKey = this.#models.get(name)?.primaryKey;

    if (!primaryKey) {
      throw new Error(`Model ${name} not defined`);
    }

    return this.#query(`DELETE
                        FROM ${name} ${this.#whereSerialize(options.where)}`);
  }

  getPrimaryKey<DbModel extends UnknownObject>(name: Models[number]): StringKey<DbModel> {
    const primaryKey = this.#models.get(name)?.primaryKey;

    if (!primaryKey) {
      throw new Error(`Model ${name} not defined`);
    }

    return primaryKey;
  }

  insert<DbModel extends UnknownObject>(
    name: Models[number],
    options: InsertOptions<DbModel>,
  ): Promise<QueryResult<DbModel>> {
    const { attributes, params, values } = this.#objectSerialize(name, options.object);

    return this.#query<DbModel>(
      `INSERT INTO ${name} (${attributes})
         VALUES (${params})`,
      values,
    );
  }

  select<DbModel extends UnknownObject>(
    name: Models[number],
    options: SelectOptions<DbModel>,
  ): Promise<QueryResult<DbModel>> {
    if (!this.#models.has(name)) {
      throw new Error(`Model ${name} not defined`);
    }

    const attributes: string[] = options.attributes ?? this.#models.get(name)?.attributes ?? [];
    const params: unknown[] = [];
    let paramIndex = 1;

    const limit = options.limit ? `LIMIT $${paramIndex++}` : '';
    if (limit) {
      params.push(options.limit);
    }

    const offset = options.offset ? `OFFSET $${paramIndex++}` : '';
    if (offset) {
      params.push(options.offset);
    }

    return this.#query<DbModel>(
      `SELECT ${attributes}
         FROM ${name} ${this.#whereSerialize(options.where)} ${limit} ${offset}`,
      params,
    );
  }

  update<DbModel extends UnknownObject>(
    name: Models[number],
    options: UpdateOptions<DbModel>,
  ): Promise<QueryResult<DbModel>> {
    const { attributes, params, values } = this.#objectSerialize(name, options.object);

    const updates = attributes.map((attribute, index) => `${attribute} = ${params[index]}`);

    return this.#query<DbModel>(
      `UPDATE ${name}
         SET ${updates} ${this.#whereSerialize(options.where)}`,
      values,
    );
  }

  #objectSerialize<DbModel extends UnknownObject>(name: Models[number], object: Partial<DbModel>) {
    const definedAttributes = new Set(this.#models.get(name)?.attributes ?? []);

    const attributes: string[] = [];
    const params: unknown[] = [];
    const values: string[] = [];

    for (const [attribute, value] of Object.entries(object)) {
      // guard against properties that are not in the model
      if (!definedAttributes.has(attribute)) {
        continue;
      }

      attributes.push(escapeIdentifier(attribute));
      params.push(`$${attributes.length}`);
      values.push(value);
    }

    return { attributes, params, values };
  }

  #whereSerialize<DbModel extends UnknownObject>(where?: Partial<DbModel>) {
    if (!where) {
      return '';
    }

    const fields = Object.entries(where)
      .map(([key, value]) => `${key} = ${escapeLiteral(value.toString())}`)
      .join(' AND ');

    return `WHERE ${fields}`;
  }
}
