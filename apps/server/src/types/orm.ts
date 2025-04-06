import type { StringKey, UnknownObject } from '@pk/types/helpers.js';
import type { QueryResult } from 'pg';

export type DeleteOptions<DbModel extends UnknownObject> = {
  where: Partial<DbModel>;
};

export type InsertOptions<DbModel extends UnknownObject> = {
  object: Partial<DbModel>;
};

export type SelectOptions<DbModel extends UnknownObject> = {
  attributes?: StringKey<DbModel>[];
  limit?: null | number;
  offset?: null | number;
  where?: Partial<DbModel>;
};

export type UpdateOptions<DbModel extends UnknownObject> = {
  object: Partial<DbModel>;
  where: Partial<DbModel>;
};

export type IORM<Models extends string[] = string[]> = {
  delete<DbModel extends UnknownObject>(
      name: Models[number],
      options: DeleteOptions<UnknownObject>,
  ): Promise<QueryResult<DbModel>>;

  getPrimaryKey<DbModel extends UnknownObject>(model: Models[number]): StringKey<DbModel>;

  insert<DbModel extends UnknownObject>(
      name: Models[number],
      options: InsertOptions<DbModel>,
  ): Promise<QueryResult<DbModel>>;

  select<DbModel extends UnknownObject>(
      name: Models[number],
      options: SelectOptions<DbModel>,
  ): Promise<QueryResult<DbModel>>;

  update<DbModel extends UnknownObject>(
      name: Models[number],
      options: UpdateOptions<DbModel>,
  ): Promise<QueryResult<DbModel>>;
};
