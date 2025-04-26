import './pageContent.css';
import type { Component } from '../../types/component.ts';
import { BaseComponent } from '../BaseComponent/BaseComponent.ts';
import { Button } from '../Button/Button.ts';
import type { ListPageAction } from './types.ts';

type ListPageContentProps = {
  actions: ListPageAction[];
};

export class ListPageContent extends BaseComponent {
  #actions: Component;
  #buttons: Component[];
  #list: Component;

  constructor({ actions }: ListPageContentProps) {
    super('div');
    this.addClass('ListPageContent-root');

    this.#actions = new BaseComponent('div').addClass('ListPageContent-actions');
    this.#buttons = actions.map(action => new Button(action.label).onClick(action.onClick).setFullWidth());
    this.#list = new BaseComponent('div').addClass('ListPageContent-list');
  }

  render(): HTMLElement {
    return this.children([this.#list, this.#actions.children(this.#buttons)]).root;
  }

  setContent(content: Component) {
    this.#list.children(content);
    return this;
  }
}
