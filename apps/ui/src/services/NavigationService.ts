import type { Component } from '../types/component.ts';
import type { NavigationPaths } from '../types/navigationPaths.ts';
import { removeChildren } from '../utils/removeChildren.ts';
import type { SessionService } from './SessionService.ts';

type RenderSingle = {
  render(): HTMLElement;
};

type ComponentConstructor = new () => Omit<Component, 'render'> & RenderSingle;

export type Route = {
  Component: ComponentConstructor;
  Container?: ComponentConstructor;
  parentSelector: string;
  redirectTo?: string;
};

export type Routes = Map<string, Route>;

export class NavigationService<TPaths extends string> {
  #loginPath: `#${NavigationPaths}` = '#/';
  #mainPath: `#${NavigationPaths}` = '#/home/events';

  #sessionService: SessionService;
  #routes: Routes = new Map<TPaths, Route>();

  constructor(sessionService: SessionService) {
    this.#sessionService = sessionService;

    window.onpopstate = this.onRouteChange.bind(this);
  }

  addRoute(path: TPaths, route: Route) {
    this.#routes.set(path, route);
    return this;
  }

  start() {
    this.onRouteChange();
    return this;
  }

  onRouteChange() {
    const session = this.#sessionService.session;

    const currentPath = this.#getPath();

    const authenticatedPath = this.#routes.has(currentPath) ? currentPath : this.#getPath(this.#mainPath);

    const path = session ? authenticatedPath : this.#getPath(this.#loginPath);
    const route = this.#routes.get(path);

    // biome-ignore lint/suspicious/noConsole: it is used for debugging purposes
    console.debug(`Pushing state to history: "#${path}"`);
    window.history.pushState(null, '', `#${path}`);

    if (!route) {
      throw new Error(`Route "${path}" not found`);
    }

    this.#renderRoute(path, route);
  }

  #getPath(hash = window.location.hash) {
    return hash.slice(hash.indexOf('#') + 1);
  }

  #renderRoute(path: string, route: Route) {
    if (route.Container) {
      const Container = new route.Container().render();
      removeChildren(document.body).appendChild(Container);
    }

    const parent = document.querySelector(route.parentSelector);

    if (!parent) {
      return console.error(`Route "${path}" has no parent selector "${route.parentSelector}" in DOM`);
    }

    const Component = new route.Component().render();
    removeChildren(parent).appendChild(Component);
  }
}
