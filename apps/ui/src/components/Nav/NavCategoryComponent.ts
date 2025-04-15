import type { Component } from '../../types/component.ts';
import { BaseComponent } from '../BaseComponent.ts';
import { Typography } from '../Typography/Typography.ts';
import { NavCategoryItemComponent } from './NavCategoryItemComponent.ts';
import type { NavCategory } from './types.ts';

export class NavCategoryComponent extends BaseComponent {
  #header: Component;
  #items: Component;

  constructor(config: NavCategory) {
    super('div');
    this.addClass('NavCategory-root');

    this.#header = new Typography({ text: config.name, variant: 'h3' }).addClass('NavCategory-header');

    this.#items = new BaseComponent('ul')
        .addClass('NavCategory-items')
        .children(config.items.map(item => new NavCategoryItemComponent(item)));
  }

  render(): HTMLElement {
    return this.children([this.#header, this.#items]).root;
  }
}
