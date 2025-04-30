import './checkbox.css';
import type { CanBeDisabled, Component } from '../../types/component.ts';
import { BaseComponent } from '../BaseComponent/BaseComponent.ts';
import { Typography } from '../Typography/Typography.ts';

type CheckboxProps = {
  checked?: boolean;
  label: string;
  name: string;
};

export class Checkbox extends BaseComponent implements CanBeDisabled {
  #label: Component;
  #checkbox: Component;
  #checkboxArea: Component;
  #checkboxMark: Component;

  #name: string;

  constructor({ checked, label, name }: CheckboxProps) {
    super('div');
    this.addClass('Checkbox-root');

    this.#name = name;

    this.#checkbox = new BaseComponent('input')
      .addClass('Checkbox-input')
      .setAttribute('id', this.#name)
      .setAttribute('name', this.#name)
      .setAttribute('type', 'checkbox');

    if (checked) {
      this.#checkbox.setAttribute('checked', 'true');
    }

    this.#checkboxArea = new BaseComponent('span').addClass('Checkbox-area');
    this.#checkboxMark = new BaseComponent('span').addClass('Checkbox-mark');

    this.#label = new Typography({ tag: 'label', text: label, variant: 'caption' }).setAttribute('for', this.#name);
  }

  render(): HTMLElement {
    return this.children([this.#checkbox, this.#checkboxArea.children(this.#checkboxMark), this.#label]).root;
  }

  setEnabled() {
    this.removeClass('Modifier-disabled');
    this.#checkbox.removeAttribute('disabled');
    return this;
  }

  setDisabled() {
    this.addClass('Modifier-disabled');
    this.#checkbox.setAttribute('disabled', 'true');
    return this;
  }

  setStatus(status: 'disabled' | 'enabled') {
    return status === 'disabled' ? this.setDisabled() : this.setEnabled();
  }
}
