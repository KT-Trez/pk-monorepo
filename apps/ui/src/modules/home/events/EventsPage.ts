import { BaseComponent } from '../../../components/BaseComponent/BaseComponent.ts';
import { PageHeader } from '../../../components/PageHeader/PageHeader.ts';
import type { Component } from '../../../types/component.ts';

export class EventsPage extends BaseComponent {
  #pageHeader: Component;

  constructor() {
    super('div');
    this.#pageHeader = new PageHeader('Events');
  }

  render(): HTMLElement {
    return this.children([this.#pageHeader]).root;
  }
}
