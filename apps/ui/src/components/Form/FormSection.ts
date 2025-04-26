import './formSection.css';
import type { Component } from '../../types/component.ts';
import { BaseComponent } from '../BaseComponent/BaseComponent.ts';
import { Typography } from '../Typography/Typography.ts';

type FormSectionProps = {
  fields: Component[];
  title: string;
};

export class FormSection extends BaseComponent {
  #content: Component;
  #fields: Component[];
  #title: Component;

  constructor({ fields, title }: FormSectionProps) {
    super('div');
    this.addClass('FormSection-root');

    this.#content = new BaseComponent('div').addClass('FormSection-content');
    this.#fields = fields;
    this.#title = new Typography({ text: title, variant: 'h3' }).addClass('FormSection-title');
  }

  render(): HTMLElement {
    return this.children([this.#title, this.#content.children(this.#fields)]).root;
  }
}
