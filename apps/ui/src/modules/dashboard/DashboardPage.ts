import { BaseComponent } from '../../components/BaseComponent.ts';
import { Nav } from '../../components/Nav/Nav.ts';
import { TopBar } from '../../components/TopBar.ts';
import type { Component } from '../../types/component.ts';
import { navConfig } from './constants.ts';

export class DashboardPage extends BaseComponent {
  #content: Component;
  #main: Component;
  #nav: Component;
  #topBar: Component;

  constructor() {
    super('div');

    this.#content = new BaseComponent('div').setStyle({
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      height: 'calc(100vh - var(--topbar-height))',
      width: '100%',
    });
    this.#main = new BaseComponent('main').setStyle({ gridColumn: '3 / 13' });
    this.#nav = new Nav(navConfig);
    this.#topBar = new TopBar();
  }

  render(): HTMLElement {
    return this.children([this.#topBar, this.#content.children([this.#nav, this.#main])]).root;
  }
}
