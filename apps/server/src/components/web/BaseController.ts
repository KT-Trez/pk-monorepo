import type { HttpHandle, HttpMethods } from '../../types/http.ts';

export type RoutePath = `${HttpMethods} ${string}`;

export abstract class BaseController {
  protected routes: Map<RoutePath, HttpHandle[]> = new Map();

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

  _getPaths() {
    return this.routes.keys();
  }

  _getRoute(path: RoutePath) {
    return this.routes.get(path);
  }

  #addRoute(method: HttpMethods, path: string, httpHandles: HttpHandle[]) {
    this.routes.set(`${method} ${path}`, httpHandles);
    return this;
  }
}
