import type { StringKey, UnknownObject } from '@pk/types/helpers.js';
import pg, { type QueryResult } from 'pg';
import type { QueryFunction } from '../types/database.ts';
import type { DeleteOptions, InsertOptions, IORM, SelectOptions, UpdateOptions } from '../types/orm.js';

const { escapeLiteral } = pg;

type Model = {
  attributes: string[];
  primaryKey: string;
};

// biome-ignore lint/style/useNamingConvention: ORM stands for Object Relational Mapping and is common shorthand
export class ORM<Models extends string[]> implements IORM<Models> {
  #models: Map<Models[number], Model>;
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
    const attributes: string[] = options.attributes ?? this.#models.get(name)?.attributes ?? [];
    const params = Object.values(options.values);
    const values = attributes.map((_, index) => `$${index + 1}`);

    return this.#query<DbModel>(
        `INSERT INTO ${name} (${attributes})
         VALUES (${values})`,
        params,
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
    const offset = options.offset ? `OFFSET $${paramIndex++}` : '';
    const orderBy = options.orderBy ? `ORDER BY $${paramIndex++}` : '';

    if (limit) {
      params.push(options.limit);
    }

    if (offset) {
      params.push(options.offset);
    }

    if (orderBy) {
      params.push(options.orderBy);
    }

    return this.#query<DbModel>(
        `SELECT ${attributes}
         FROM ${name} ${this.#whereSerialize(options.where)} ${orderBy} ${limit} ${offset}`,
        params,
    );
  }

  update<DbModel extends UnknownObject>(
      name: Models[number],
      options: UpdateOptions<DbModel>,
  ): Promise<QueryResult<DbModel>> {
    throw new Error('Method not implemented.');
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
