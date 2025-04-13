import type { Component } from '../types/component.ts';
import { removeChildren } from '../utils/removeChildren.ts';

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
  #routes: Routes = new Map<TPaths, Route>();

  constructor() {
    window.addEventListener('popstate', this.#onRouteChange.bind(this));
  }

  addRoute(path: TPaths, route: Route) {
    this.#routes.set(path, route);
    return this;
  }

  start() {
    const path = this.#getCurrentPath();
    const route = this.#routes.get(path);

    if (route) {
      return this.#loadRoute(path, route);
    }

    const defaultPath = '/';
    const defaultRoute = this.#routes.get(defaultPath);

    if (!defaultRoute) {
      return console.error(`Default route "${defaultPath}" not found`);
    }

    window.history.pushState(null, '', defaultPath);
    this.#loadRoute(defaultPath, defaultRoute);
  }

  #getCurrentPath() {
    return location.hash.slice(1);
  }

  #loadRoute(path: string, route: Route) {
    // todo: redirect when user is not authorized

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

  #onRouteChange(_: PopStateEvent) {
    const path = this.#getCurrentPath();
    const route = this.#routes.get(path);

    if (!route) {
      return window.history.pushState(null, '', '/');
    }

    this.#loadRoute(path, route);
  }
}
