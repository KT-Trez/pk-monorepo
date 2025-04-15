import { BaseComponent } from '../../../components/BaseComponent.ts';

export class UsersPage extends BaseComponent {
  constructor() {
    super('p');
    this.setTextContent('UsersPage works!');
  }

  render(): HTMLElement {
    return this.root;
  }
}
