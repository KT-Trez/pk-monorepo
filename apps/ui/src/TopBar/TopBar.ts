import { BaseComponent } from '../components/BaseComponent/BaseComponent.ts';
import { Logo } from '../components/Logo/Logo.ts';
import type { Component } from '../types/component.ts';

export class TopBar extends BaseComponent {
  #logo: Component;

  constructor() {
    super('div');

    this.setStyle({
      background: 'var(--color-elevation-1)',
      height: 'var(--topbar-height)',
      paddingBlock: 'var(--sizing-2)',
      paddingInline: 'var(--sizing-4)',
      width: '100%',
    });

    this.#logo = new Logo('100%').setStyle({ height: '100%', width: 'fit-content' });
  }

  render(): HTMLElement {
    return this.children(this.#logo).root;
  }
}
