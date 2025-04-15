import { BaseComponent } from '../../../components/BaseComponent.ts';

export class AccountPage extends BaseComponent {
  constructor() {
    super('p');
    this.setTextContent('AccountPage works!');
  }

  render(): HTMLElement {
    return this.root;
  }
}
