import './nav.css';
import type { Component } from '../../types/component.ts';
import { BaseComponent } from '../BaseComponent.ts';
import { NavCategoryComponent } from './NavCategoryComponent.ts';
import type { NavCategory } from './types.ts';

export class Nav extends BaseComponent {
  #categories: Component[];

  constructor(config: NavCategory[]) {
    super('nav');
    this.addClass('Nav-root');

    this.#categories = config.map(category => new NavCategoryComponent(category));
  }

  render(): HTMLElement {
    return this.children(this.#categories).root;
  }
}
