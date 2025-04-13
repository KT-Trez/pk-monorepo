import { BaseComponent } from '../../../components/BaseComponent.ts';

export class EventsPage extends BaseComponent {
  constructor() {
    super('p');
    this.setTextContent('EventsPage works!');
  }

  render(): HTMLElement {
    return this.root;
  }
}
