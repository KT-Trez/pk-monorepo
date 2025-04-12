import type { Component } from '../types/component.ts';
import { BaseComponent } from './BaseComponent.ts';

export class Logo extends BaseComponent {
  #img: Component;

  constructor(height?: number, width?: number) {
    super('div');

    this.setStyle({ textAlign: 'center' });

    this.#img = new BaseComponent('img')
        .setAttribute('alt', 'WIiT logo')
        .setAttribute('src', '/public/wiit.png')
        .setStyle({
          aspectRatio: '1',
          height: height ? `${height}px` : undefined,
          margin: 'auto',
          width: width ? `${width}px` : undefined,
        });
  }

  render(): HTMLElement {
    return this.children(this.#img).root;
  }
}
