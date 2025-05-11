import './desktopNav.css';
import type { Component } from '../../../types/component.ts';
import { BaseComponent } from '../../BaseComponent/BaseComponent.ts';
import { NavCategoryComponent } from '../NavCategoryComponent.ts';
import type { NavCategory } from '../types.ts';

export class DesktopNav extends BaseComponent {
  #categories: Component[];

  constructor(config: NavCategory[]) {
    super('nav');
    this.addClass('DesktopNav-root');

    this.#categories = config.reduce<Component[]>((acc, category) => {
      if (!category.isHidden) {
        acc.push(new NavCategoryComponent(category));
      }

      return acc;
    }, []);
  }

  render(): HTMLElement {
    return this.children(this.#categories).root;
  }
}
