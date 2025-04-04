import { MethodNotAllowedError } from './errors/MethodNotAllowedError.ts';
import { NotFoundError } from './errors/NotFoundError.ts';
import { ServerError } from './errors/ServerError.ts';
import type { AllowedMethod, HttpHandler, UseRequestHandle } from './types.js';
import type { WebServerRequest } from './WebServerRequest.js';
import type { WebServerResponse } from './WebServerResponse.js';

export class Router implements UseRequestHandle {
  protected routes: Map<AllowedMethod, Map<string, HttpHandler[]>>;

  constructor() {
    this.routes = new Map();
    this.routes.set('*', new Map());
    this.routes.set('DELETE', new Map());
    this.routes.set('GET', new Map());
    this.routes.set('POST', new Map());
    this.routes.set('PUT', new Map());
  }

  delete(path: string, ...handlers: HttpHandler[]) {
    this.registerHandler('DELETE', path, handlers);
  }

  get(path: string, ...handlers: HttpHandler[]) {
    this.registerHandler('GET', path, handlers);
  }

  post(path: string, ...handlers: HttpHandler[]) {
    this.registerHandler('POST', path, handlers);
  }

  put(path: string, ...handlers: HttpHandler[]) {
    this.registerHandler('PUT', path, handlers);
  }

  use(path: string, ...handlers: HttpHandler[]) {
    this.registerHandler('*', path, handlers);
  }

  async _requestHandle(path: string, req: WebServerRequest, res: WebServerResponse) {
    if (!req.method) {
      res.setHeader('Allow', 'DELETE, GET, POST, PUT');
      return res.error(new MethodNotAllowedError(req.method));
    }

    // find the route handlers
    const methodRoutes = this.routes.get(req.method as AllowedMethod)?.get(path);
    const wildcardRoutes = this.routes.get('*')?.get(path);

    const routes = methodRoutes ?? wildcardRoutes;

    if (!routes) {
      return res.error(new NotFoundError(`[PATH] "${path}"`));
    }

    try {
      // prepare the next function
      let error: ServerError | null = null;
      const next = (err: ServerError) => {
        error = err;
      };

      // iterate and call the route handlers
      for (const route of routes) {
        if (error) {
          break;
        }

        const isRouteHandle = typeof route === 'function';

        if (isRouteHandle) {
          await route(req, res, next);
        } else {
          const path = req._getNextPath();

          if (!path) {
            return res.error(new NotFoundError(`[PATH] "${path}"`));
          }

          await route._requestHandle(path, req, res);
        }
      }

      if (error) {
        res.error(error);
      }
    } catch (error) {
      res.error(new ServerError({ cause: error }));
    }
  }

  protected registerHandler(method: AllowedMethod, path: string, handlers: HttpHandler[]) {
    const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
    this.routes.get(method)?.set(normalizedPath, handlers);
  }
}
