import './navCategoryItem.css';
import { BaseComponent } from '../BaseComponent/BaseComponent.ts';
import { Typography } from '../Typography/Typography.ts';
import type { NavCategoryItem } from './types.ts';

export class NavCategoryItemComponent extends BaseComponent {
  #link: BaseComponent;

  constructor(config: NavCategoryItem) {
    super('li');

    if (window.location.hash === config.href) {
      this.addClass('NavCategory-item--active');
    }

    this.#link = new Typography({ tag: 'a', text: config.name })
      .addClass('NavCategory-item')
      .setAttribute('href', config.href);
  }

  render(): HTMLElement {
    return this.children(this.#link).root;
  }
}
