import type { ConstValues, UnknownObject } from './helpers.js';

export type ErrorApi = {
  code: HttpStatuses;
  message: string;
  meta?: UnknownObject;
  success: false;
};

export type CollectionApi<T> = {
  hasMore: boolean;
  items: T[];
  limit: number;
  offset: number;
};

export const HttpStatus = {
  BadRequest: 400,
  Forbidden: 403,
  InternalServerError: 500,
  MethodNotAllowed: 405,
  NotFound: 404,
  Ok: 200,
  Unauthorized: 401,
} as const;
export type HttpStatuses = ConstValues<typeof HttpStatus>;

export type SuccessApi = {
  code: HttpStatuses;
  message: string;
  success: true;
};
