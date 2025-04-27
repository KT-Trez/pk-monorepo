import './nameCell.css';
import type { Component } from '../../../types/component.ts';
import { BaseComponent } from '../../BaseComponent/BaseComponent.ts';
import { Typography } from '../../Typography/Typography.ts';

export class NameCell extends BaseComponent {
  #name: Component;
  #uid: Component;

  constructor(name: string, uid: string) {
    super('div');
    this.addClass('NameCell-root');

    this.#name = new Typography({ text: name, variant: 'body1' });
    this.#uid = new Typography({ text: uid, variant: 'body2' }).addClass('NameCell-uid');
  }

  render(): HTMLElement {
    return this.children([this.#name, this.#uid]).root;
  }
}
