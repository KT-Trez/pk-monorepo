import './select.css';
import type { CanBeDisabled, CanBeRerendered, Component } from '../../types/component.ts';
import { BaseComponent } from '../BaseComponent/BaseComponent.ts';
import { Icon } from '../Icon/Icon.ts';
import { Typography } from '../Typography/Typography.ts';

type SelectOptions<T> = {
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => string;
};

export class Select<T> extends BaseComponent implements CanBeDisabled, CanBeRerendered<T> {
  #config: SelectOptions<T>;
  #name: string;
  #options: T[];

  #control: Component;
  #icons: { end: Component<'span'> | null; start: Component<'span'> | null };
  #label: Component<'label'> | null;
  #input: Component<'select'>;

  constructor(name: string, config: SelectOptions<T> = {}) {
    super('div');
    this.addClass('Select-root');

    this.#config = config;
    this.#name = name;
    this.#options = [];

    this.#control = new BaseComponent('div').addClass('Select-control');
    this.#label = null;
    this.#icons = { end: null, start: null };
    this.#input = new BaseComponent('select')
      .addClass('typography-body-1')
      .setAttribute('id', this.#name)
      .setAttribute('name', this.#name);
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

  renderData() {
    const options: Component[] = this.#options.map(option => {
      const value = this.#config.getOptionValue ? this.#config.getOptionValue(option) : String(option);
      const label = this.#config.getOptionLabel ? this.#config.getOptionLabel(option) : String(option);

      return new Typography({ text: label, tag: 'option' }).setAttribute('value', value);
    });

    this.#input.children(options);

    return this;
  }

  setDisabled() {
    this.addClass('Modifier-disabled');
    this.#input.setAttribute('disabled', 'true');
    return this;
  }

  setEnabled() {
    this.removeClass('Modifier-disabled');
    this.#input.removeAttribute('disabled');
    return this;
  }

  setFullWidth() {
    this.addClass('Select-root--fullWidth');
    return this;
  }

  setLabel(label: string) {
    this.#label = new Typography({ tag: 'label', text: label, variant: 'caption' }).setAttribute('for', this.#name);
    return this;
  }

  setData(options: T[]) {
    this.#options = options;
    this.renderData();
    return this;
  }

  setRequired() {
    this.#input.setAttribute('required', 'true');
    return this;
  }

  setStatus(status: 'disabled' | 'enabled') {
    return status === 'disabled' ? this.setDisabled() : this.setEnabled();
  }
}
