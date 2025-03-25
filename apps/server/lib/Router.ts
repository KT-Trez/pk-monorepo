import type { WebServerRequest } from './WebServerRequest.js';
import type { WebServerResponse } from './WebServerResponse.js';
import type { HttpHandler, RequestMethods, UseRequestHandler } from './types.js';

export class Router implements UseRequestHandler {
  #handlerMap: Record<RequestMethods, Map<string, HttpHandler[]>>;

  constructor() {
    this.#handlerMap = {
      '*': new Map(),
      DELETE: new Map(),
      GET: new Map(),
      POST: new Map(),
      PUT: new Map(),
    };
  }

  delete(path: string, ...handlers: HttpHandler[]) {
    this.#registerHandler('DELETE', path, handlers);
  }

  get(path: string, ...handlers: HttpHandler[]) {
    this.#registerHandler('GET', path, handlers);
  }

  post(path: string, ...handlers: HttpHandler[]) {
    this.#registerHandler('POST', path, handlers);
  }

  put(path: string, ...handlers: HttpHandler[]) {
    this.#registerHandler('PUT', path, handlers);
  }

  use(path: string, ...handlers: HttpHandler[]) {
    this.#registerHandler('*', path, handlers);
  }

  // biome-ignore lint/suspicious/useAwait: await will be added in a future PR
  protected async handleRequest(path: string, req: WebServerRequest, res: WebServerResponse) {
    if (!req.method) {
      res.setHeader('Allow', 'GET, POST, DELETE, PUT');
      return res.error({ status: 405, message: 'Method Not Allowed' });
    }

    const globalHandlers = this.#handlerMap['*']?.get(path);
    // even if the method is invalid, the undefined value will be handled normally
    const methodHandlers = this.#handlerMap[req.method as RequestMethods]?.get(path);

    const handlers = methodHandlers ?? globalHandlers;

    if (!handlers) {
      return res.error({ status: 404, message: 'Not Found' });
    }

    try {
      for (const _handler of handlers) {
        // todo: run the handler
      }
    } catch (error) {
      res.error({ cause: error, status: 500, message: 'Internal Server Error' });
    }
  }

  #registerHandler(method: RequestMethods, path: string, handlers: HttpHandler[]) {
    this.#handlerMap[method]?.set(path, handlers);
  }
}
