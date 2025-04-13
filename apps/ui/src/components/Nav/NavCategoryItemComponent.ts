import { BaseComponent } from '../BaseComponent.ts';
import type { NavCategoryItem } from './types.ts';

export class NavCategoryItemComponent extends BaseComponent {
  #link: BaseComponent;

  constructor(config: NavCategoryItem) {
    super('li');

    this.#link = new BaseComponent('a')
        .addClasses(['NavCategory-item', 'typography-body-1'])
        .setAttribute('href', config.href)
        .setTextContent(config.name);
  }

  render(): HTMLElement {
    return this.children(this.#link).root;
  }
}
