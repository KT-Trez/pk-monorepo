import type { Component } from '../../types/component.ts';
import { BaseComponent } from '../BaseComponent.ts';
import { NavCategoryItemComponent } from './NavCategoryItemComponent.ts';
import type { NavCategory } from './types.ts';

export class NavCategoryComponent extends BaseComponent {
  #header: Component;
  #items: Component;

  constructor(config: NavCategory) {
    super('div');
    this.addClass('NavCategory-root');

    this.#header = new BaseComponent('h3')
        .addClasses(['NavCategory-header', '.typography-body-1'])
        .setTextContent(config.name);

    this.#items = new BaseComponent('ul')
        .addClass('NavCategory-items')
        .children(config.items.map(item => new NavCategoryItemComponent(item)));
  }

  render(): HTMLElement {
    return this.children([this.#header, this.#items]).root;
  }
}
