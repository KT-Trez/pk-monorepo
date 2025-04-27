import './topBar.css';
import { sessionService } from '../../main.ts';
import type { Component } from '../../types/component.ts';
import { navigate } from '../../utils/navigate.ts';
import { BaseComponent } from '../BaseComponent/BaseComponent.ts';
import { Button } from '../Button/Button.ts';
import { Logo } from '../Logo/Logo.ts';

export class TopBar extends BaseComponent {
  #logo: Component;
  #logout: Component;

  constructor() {
    super('div');
    this.addClass('TopBar-root');

    this.#logout = new Button({ icon: 'logout', variant: 'icon' }).onClick(this.#onLogout).setFitContentWith();
    this.#logo = new Logo('100%').setStyle({ height: '100%', width: 'fit-content' });
  }

  render(): HTMLElement {
    return this.children([this.#logo, this.#logout]).root;
  }

  #onLogout() {
    sessionService.clear();
    navigate('#/');
  }
}
