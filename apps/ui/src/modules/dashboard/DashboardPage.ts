import './dashboard.css';
import { BaseComponent } from '../../components/BaseComponent/BaseComponent.ts';
import { Nav } from '../../components/Nav/Nav.ts';
import { TopBar } from '../../TopBar/TopBar.ts';
import type { Component } from '../../types/component.ts';
import { navConfig } from './constants.ts';

export class DashboardPage extends BaseComponent {
  #content: Component;
  #main: Component;
  #nav: Component;
  #topBar: Component;

  constructor() {
    super('div');

    this.#content = new BaseComponent('div').addClass('Dashboard-root');
    this.#main = new BaseComponent('main').addClass('Dashboard-main');
    this.#nav = new Nav(navConfig);
    this.#topBar = new TopBar();
  }

  render(): HTMLElement {
    return this.children([this.#topBar, this.#content.children([this.#nav, this.#main])]).root;
  }
}
