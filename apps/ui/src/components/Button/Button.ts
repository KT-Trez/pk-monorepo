import './button.css';
import type { CanBeClicked, CanBeDisabled, Component } from '../../types/component.ts';
import { BaseComponent } from '../BaseComponent/BaseComponent.ts';
import { Icon } from '../Icon/Icon.ts';
import { buttonClassNames } from './constants.ts';
import type { ButtonVariant } from './types.ts';

type ButtonProps = BaseButtonProps | IconButtonProps;

type BaseButtonProps = {
  icon?: string;
  text: string;
  variant?: typeof ButtonVariant.Contained | typeof ButtonVariant.Outlined;
};

type IconButtonProps = {
  icon: string;
  text?: undefined;
  variant?: typeof ButtonVariant.Icon;
};

export class Button extends BaseComponent<'button'> implements CanBeClicked, CanBeDisabled {
  #icon: Component | null;

  constructor({ icon, text, variant = 'contained' }: ButtonProps) {
    const className = buttonClassNames[variant];

    super('button');
    this.addClasses(['Button-root', className]);

    this.#icon = icon ? new Icon(icon) : null;

    if (text) {
      this.setTextContent(text);
    }
  }

  onClick(callback: () => void) {
    this.root.addEventListener('click', callback);
    return this;
  }

  render(): HTMLElement {
    if (this.#icon) {
      return this.children(this.#icon).root;
    }

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
