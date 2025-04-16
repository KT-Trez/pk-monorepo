import type { UnknownObject } from '@pk/types/helpers.js';
import type { HttpHandle, HttpMethods } from '../../types/http.ts';

export type RoutePath = `${HttpMethods} ${string}`;

export abstract class BaseController {
  protected routes: Map<RoutePath, HttpHandle[]> = new Map();

  protected static removeUndefined<T extends UnknownObject>(obj: T): Partial<T> {
    const newObj: Partial<T> = {};

    for (const key in obj) {
      if (obj[key] !== undefined) {
        newObj[key] = obj[key];
      }
    }

    return newObj;
  }

  delete(path: string, onRequest: (controller: this) => HttpHandle[]) {
    return this.#addRoute('DELETE', path, onRequest(this));
  }

  get(path: string, onRequest: (controller: this) => HttpHandle[]) {
    return this.#addRoute('GET', path, onRequest(this));
  }

  post(path: string, onRequest: (controller: this) => HttpHandle[]) {
    return this.#addRoute('POST', path, onRequest(this));
  }

  put(path: string, onRequest: (controller: this) => HttpHandle[]) {
    return this.#addRoute('PUT', path, onRequest(this));
  }

  _getRoutes(path: RoutePath) {
    return this.routes.get(path);
  }

  #addRoute(method: HttpMethods, path: string, httpHandles: HttpHandle[]) {
    this.routes.set(`${method} ${path}`, httpHandles);
    return this;
  }
}
