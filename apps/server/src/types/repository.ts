import type { DeepPartial, UnknownObject } from '@pk/types/helpers.js';

export type BaseRepository<T extends UnknownObject, C> = Reader<T, C> & Writer<T, C>;

export type FindOptions<T extends UnknownObject, C> = {
  attributes?: (keyof T)[];
  tx?: C;
};

export type FindManyOptions<T extends UnknownObject, C> = FindOptions<T, C> & {
  limit?: number;
  offset?: number;
  orderBy?: keyof T | (keyof T)[];
};

export type QueryExpression<T extends UnknownObject> = Partial<T> & {
  [K in keyof T as `${string & K}__in`]?: string[];
};

export type Reader<T extends UnknownObject, C> = {
  find(query: QueryExpression<T>, options?: FindManyOptions<T, C>): Promise<T[]>;
  findOne(primaryKeyOrQuery: string | QueryExpression<T>, options?: FindOptions<T, C>): Promise<T | undefined>;
};

export type Writer<T extends UnknownObject, C> = {
  create(object: DeepPartial<T>, tx?: C): Promise<T>;
  delete(primaryKeyOrQuery: string | QueryExpression<T>, tx?: C): Promise<boolean>;
  update(primaryKeyOrQuery: string | QueryExpression<T>, object: DeepPartial<T>, tx?: C): Promise<T | undefined>;
};
