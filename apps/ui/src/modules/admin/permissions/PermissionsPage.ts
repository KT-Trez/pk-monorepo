import { BaseComponent } from '../../../components/BaseComponent/BaseComponent.ts';

export class PermissionsPage extends BaseComponent {
  constructor() {
    super('p');
    this.setTextContent('PermissionsPage works!');
  }

  render(): HTMLElement {
    return this.root;
  }
}
