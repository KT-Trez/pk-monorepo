import type { WebServerRequest } from './WebServerRequest.js';
import type { WebServerResponse } from './WebServerResponse.js';

export type HttpHandler = RequestHandler | UseRequestHandler;

export type RequestHandler = (
  req: WebServerRequest,
  res: WebServerResponse,
) => Error | Promise<Error> | Promise<undefined> | undefined;

export type UseRequestHandler = {
  use(path: string, ...handlers: RequestHandler[]): void;
};

export type RequestMethods = '*' | 'DELETE' | 'GET' | 'POST' | 'PUT';
