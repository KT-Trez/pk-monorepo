import type { CanBeClicked, CanBeDisabled } from '../types/component.ts';
import { BaseComponent } from './BaseComponent.ts';

export class Button extends BaseComponent<'button'> implements CanBeClicked, CanBeDisabled {
  constructor(text: string) {
    super('button');

    this.addClass('Button-root').setTextContent(text);
  }

  onClick(callback: () => void) {
    this.root.addEventListener('click', callback);
    return this;
  }

  render(): HTMLElement {
    return this.root;
  }

  setDisabled() {
    this.addClass('Modifier-disabled');
    this.setAttribute('disabled', 'true');
    return this;
  }

  setEnabled() {
    this.removeClass('TextField-disabled');
    this.removeAttribute('disabled');
    return this;
  }

  setFullWidth() {
    this.addClass('Button-root--fullWidth');
    return this;
  }

  setType(type: 'button' | 'submit' | 'reset') {
    this.setAttribute('type', type);
    return this;
  }
}
