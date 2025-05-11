import './mobileNav.css';
import type { Component } from '../../../types/component.ts';
import { BaseComponent } from '../../BaseComponent/BaseComponent.ts';
import { NavCategoryComponent } from '../NavCategoryComponent.ts';
import type { NavCategory } from '../types.ts';

export class MobileNav extends BaseComponent<'dialog'> {
  #categories: Component[];
  #form: Component;

  constructor(config: NavCategory[]) {
    super('dialog');
    this.addClass('MobileNav-root').setAttribute('closedby', 'any').setAttribute('id', 'nav-dialog');
    this.root.addEventListener('click', this.#onClick);

    this.#categories = config.reduce<Component[]>((acc, category) => {
      if (!category.isHidden) {
        acc.push(new NavCategoryComponent(category));
      }

      return acc;
    }, []);

    this.#form = new BaseComponent('form').addClass('MobileNav-form').setAttribute('method', 'dialog');
  }

  render(): HTMLElement {
    return this.children([this.#form.children(this.#categories)]).root;
  }

  #onClick(event: MouseEvent): void {
    if (event.target === event.currentTarget && event.currentTarget instanceof HTMLDialogElement) {
      event.currentTarget?.close();
    }
  }
}
