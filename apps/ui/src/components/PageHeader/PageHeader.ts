import './pageHeader.css';
import type { Component } from '../../types/component.ts';
import { BaseComponent } from '../BaseComponent/BaseComponent.ts';
import { Typography } from '../Typography/Typography.ts';

export class PageHeader extends BaseComponent {
  #header: Component;

  constructor(title: string) {
    super('div');
    this.addClass('PageHeader-root');

    this.#header = new Typography({ text: title, variant: 'h2' }).addClass('PageHeader-title');
  }

  render(): HTMLElement {
    return this.children(this.#header).root;
  }
}
