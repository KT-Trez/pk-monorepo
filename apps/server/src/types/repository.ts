import type { UnknownObject } from '@pk/types/helpers.js';

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
  find(object: Partial<T>, options?: FindManyOptions<T, C>): Promise<T[]>;
  findOne(uidOrObject: string | Partial<T>, options?: FindOptions<T, C>): Promise<T>;
};

export type Writer<T extends UnknownObject, C> = {
  create(object: T, tx?: C): Promise<T>;
  delete(uidOrObject: string | Partial<T>, tx?: C): Promise<boolean>;
  update(object: Partial<T>, newObject: Partial<T>, tx?: C): Promise<T>;
};
