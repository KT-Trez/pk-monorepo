import type { ConstValues, UnknownObject } from './helpers.js';

export type ActionFailureApi = {
  objects: Record<string, boolean>;
  success: false;
} & ErrorApi;

export type ActionSuccessApi = {
  objects: Record<string, true>;
  success: true;
};

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
  badRequest: 400,
  internalServerError: 500,
  methodNotAllowed: 405,
  notFound: 404,
  ok: 200,
} as const;
export type HttpStatus = ConstValues<typeof HttpStatuses>;
