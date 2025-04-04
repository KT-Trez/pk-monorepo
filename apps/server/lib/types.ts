import type { ConstValues } from '@pk/types/helpers.js';
import type { ServerError } from './errors/ServerError.js';
import type { WebServerRequest } from './WebServerRequest.js';
import type { WebServerResponse } from './WebServerResponse.js';

export const AllowedMethods = {
  all: '*',
  delete: 'DELETE',
  get: 'GET',
  post: 'POST',
  put: 'PUT',
} as const;
export type AllowedMethod = ConstValues<typeof AllowedMethods>;

export type HttpHandler = RequestHandle | UseRequestHandle;

export type NextFunction = (error: ServerError) => void;

export type RequestHandle = (req: WebServerRequest, res: WebServerResponse, next: NextFunction) => Promise<void>;

export type UseRequestHandle = {
  _requestHandle(path: string, req: WebServerRequest, res: WebServerResponse): Promise<void>;
};
