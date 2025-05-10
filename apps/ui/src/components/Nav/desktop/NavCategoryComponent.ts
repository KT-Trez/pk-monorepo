import type { Component } from '../../../types/component.ts';
import { BaseComponent } from '../../BaseComponent/BaseComponent.ts';
import { Typography } from '../../Typography/Typography.ts';
import { NavCategoryItemComponent } from './NavCategoryItemComponent.ts';
import type { NavCategory } from '../types.ts';

export class NavCategoryComponent extends BaseComponent {
  #header: Component;
  #items: Component;

  constructor(config: NavCategory) {
    super('div');
    this.addClass('NavCategory-root');

    const items = config.items.reduce<Component[]>((acc, item) => {
      if (!item.isHidden) {
        acc.push(new NavCategoryItemComponent(item));
      }

      return acc;
    }, []);

    this.#header = new Typography({ text: config.name, variant: 'h3' }).addClass('NavCategory-header');
    this.#items = new BaseComponent('ul').addClass('NavCategory-items').children(items);
  }

  render(): HTMLElement {
    return this.children([this.#header, this.#items]).root;
  }
}
