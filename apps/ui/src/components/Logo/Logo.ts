import type { Component } from '../../types/component.ts';
import { BaseComponent } from '../BaseComponent/BaseComponent.ts';

export class Logo extends BaseComponent {
  #img: Component;

  constructor(height?: string, width?: string) {
    super('div');

    this.setStyle({ textAlign: 'center' });

    this.#img = new BaseComponent('img')
      .setAttribute('alt', 'WIiT logo')
      .setAttribute('src', '/wiit.png')
      .setStyle({
        aspectRatio: '1',
        height: height ? height : undefined,
        width: width ? width : undefined,
      });
  }

  render(): HTMLElement {
    return this.children(this.#img).root;
  }
}
