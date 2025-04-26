import './button.css';
import type { CanBeClicked, CanBeDisabled } from '../../types/component.ts';
import { BaseComponent } from '../BaseComponent/BaseComponent.ts';
import { buttonClassNames } from './constants.ts';

type ButtonProps = {
  text: string;
  variant?: 'contained' | 'outlined';
};

export class Button extends BaseComponent<'button'> implements CanBeClicked, CanBeDisabled {
  constructor({ text, variant = 'contained' }: ButtonProps) {
    const className = buttonClassNames[variant];

    super('button');
    this.addClasses(['Button-root', className]).setTextContent(text);
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

  setFitContentWith() {
    this.addClass('Button-root--fitContentWidth');
    return this;
  }

  setType(type: 'button' | 'submit' | 'reset') {
    this.setAttribute('type', type);
    return this;
  }
}
