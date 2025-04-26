import type { DeepPartial, UnknownObject } from '@pk/types/helpers.js';

export type BaseRepository<T extends UnknownObject, C> = Reader<T, C> & Writer<T, C>;

export type FindOptions<T extends UnknownObject, C> = {
  attributes?: (keyof T)[];
  tx?: C;
};

export type FindManyOptions<T extends UnknownObject, C> = FindOptions<T, C> & {
  limit?: number;
  offset?: number;
  orderBy?: keyof T;
};

export type Reader<T extends UnknownObject, C> = {
  find(query: Partial<T>, options?: FindManyOptions<T, C>): Promise<T[]>;
  findOne(primaryKeyOrQuery: string | Partial<T>, options?: FindOptions<T, C>): Promise<T | undefined>;
};

export type Writer<T extends UnknownObject, C> = {
  create(object: DeepPartial<T>, tx?: C): Promise<T>;
  delete(primaryKeyOrQuery: string | Partial<T>, tx?: C): Promise<boolean>;
  update(primaryKeyOrQuery: string | Partial<T>, object: DeepPartial<T>, tx?: C): Promise<T | undefined>;
};
