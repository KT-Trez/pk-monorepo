import { BaseComponent } from '../../../components/BaseComponent.ts';

export class SchedulePage extends BaseComponent {
  constructor() {
    super('p');
    this.setTextContent('SchedulePage works!');
  }

  render(): HTMLElement {
    return this.root;
  }
}
