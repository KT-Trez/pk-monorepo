import { BaseComponent } from '../BaseComponent.ts';

export class Icon extends BaseComponent {
  constructor(name: string) {
    super('span');
    this.addClass('material-icons').setTextContent(name);
  }

  render(): HTMLElement {
    return this.root;
  }
}
