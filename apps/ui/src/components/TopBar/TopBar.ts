import './topBar.css';
import type { SuccessApi } from '@pk/types/api.js';
import { client, sessionService } from '../../main.ts';
import type { Component } from '../../types/component.ts';
import { navigate } from '../../utils/navigate.ts';
import { BaseComponent } from '../BaseComponent/BaseComponent.ts';
import { Button } from '../Button/Button.ts';
import { Logo } from '../Logo/Logo.ts';

export class TopBar extends BaseComponent {
  #buttons: Component;
  #logo: Component;

  #logoutButton: Component;
  #navButton: Component;

  constructor() {
    super('div');
    this.addClass('TopBar-root');

    this.#buttons = new BaseComponent('div').addClass('TopBar-icons');
    this.#logo = new Logo('100%').setStyle({ height: '100%', width: 'fit-content' });
    this.#logoutButton = new Button({ icon: 'logout', variant: 'icon' }).onClick(this.#onLogout).setFitContentWith();
    this.#navButton = new Button({ icon: 'menu', variant: 'icon' })
      .addClass('TopBarIcon--mobile-only')
      .onClick(this.#onNavButtonClick)
      .setFitContentWith();
  }

  render(): HTMLElement {
    return this.children([this.#logo, this.#buttons.children([this.#logoutButton, this.#navButton])]).root;
  }

  async #onLogout() {
    await client.delete<SuccessApi>(`/v1/session?uid=${sessionService.session?.uid}`);
    sessionService.clear();
    navigate('#/');
  }

  #onNavButtonClick() {
    const navDialog = <HTMLDialogElement | null>document.getElementById('nav-dialog');
    navDialog?.showModal();
  }
}
