import './textField.css';
import type { CanBeDisabled, Component } from '../../types/component.ts';
import { BaseComponent } from '../BaseComponent/BaseComponent.ts';
import { Icon } from '../Icon/Icon.ts';
import { Typography } from '../Typography/Typography.ts';

type TextFieldTypeAttribute =
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'month'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'text'
  | 'time-local'
  | 'url'
  | 'week';

export class TextField extends BaseComponent implements CanBeDisabled {
  #name: string;

  #control: Component;
  #icons: { end: Component<'span'> | null; start: Component<'span'> | null };
  #label: Component<'label'> | null;
  #input: Component<'input'>;

  constructor(name: string) {
    super('div');
    this.addClass('TextField-root');
    this.#name = name;

    this.#control = new BaseComponent('div').addClass('TextField-control');
    this.#label = null;
    this.#icons = { end: null, start: null };
    this.#input = new BaseComponent('input').setAttribute('id', this.#name).setAttribute('name', this.#name);
  }

  render(): HTMLElement {
    return this.children([
      ...(this.#label ? [this.#label] : []),
      this.#control.children([
        ...(this.#icons.start ? [this.#icons.start] : []),
        this.#input,
        ...(this.#icons.end ? [this.#icons.end] : []),
      ]),
    ]).root;
  }

  addIcon(icon: string, position: 'start' | 'end') {
    this.#icons[position] = new Icon(icon);
    return this;
  }

  setDisabled() {
    this.addClass('Modifier-disabled');
    this.#input.setAttribute('disabled', 'true');
    return this;
  }

  setEnabled() {
    this.removeClass('TextField-disabled');
    this.#input.removeAttribute('disabled');
    return this;
  }

  setFullWidth() {
    this.addClass('TextField-root--fullWidth');
    return this;
  }

  setLabel(label: string) {
    this.#label = new Typography({ tag: 'label', text: label, variant: 'caption' }).setAttribute('for', this.#name);
    return this;
  }

  setPlaceholder(placeholder: string) {
    this.#input.setAttribute('placeholder', placeholder);
    return this;
  }

  setRequired() {
    this.#input.setAttribute('required', 'true');
    return this;
  }

  setStatus(status: 'disabled' | 'enabled') {
    return status === 'disabled' ? this.setDisabled() : this.setEnabled();
  }

  setType(type: TextFieldTypeAttribute) {
    this.#input.setAttribute('type', type);
    return this;
  }
}
