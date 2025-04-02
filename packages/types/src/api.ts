import type { ConstValues, UnknownObject } from './helpers.js';

export type ErrorApi = {
  httpStatus: HttpStatus;
  message: string;
  meta?: UnknownObject;
};

export type CollectionApi<T> = {
  items: T[];
  limit: number;
  offset: number;
};

export const HttpStatuses = {
  accepted: 202,
  badRequest: 400,
  conflict: 409,
  created: 201,
  forbidden: 403,
  internalServerError: 500,
  methodNotAllowed: 405,
  noContent: 204,
  notAcceptable: 406,
  notFound: 404,
  ok: 200,
  resetContent: 205,
  unauthorized: 401,
  unprocessableEntity: 422,
  unsupportedMediaType: 415,
} as const;
export type HttpStatus = ConstValues<typeof HttpStatuses>;
