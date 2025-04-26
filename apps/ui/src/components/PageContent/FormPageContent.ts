import './formPageContent.css';
import type { Component } from '../../types/component.ts';
import { BaseComponent } from '../BaseComponent/BaseComponent.ts';
import { Button } from '../Button/Button.ts';

type FormPageContentProps = {
  onCancel: () => void;
};

export class FormPageContent extends BaseComponent<'form'> {
  #actions: Component;
  #content: Component;

  constructor({ onCancel }: FormPageContentProps) {
    super('form');
    this.addClass('FormPageContent-root');

    this.#actions = new BaseComponent('div')
      .addClass('FormPageContent-actions')
      .children([
        new Button({ text: 'Save' }).setFitContentWith().setType('submit'),
        new Button({ text: 'Cancel', variant: 'outlined' }).onClick(onCancel).setFitContentWith().setType('button'),
      ]);

    this.#content = new BaseComponent('div').addClass('FormPageContent-content');
  }

  onSubmit(callback: (formData: FormData) => void) {
    this.root.addEventListener('submit', event => {
      event.preventDefault();
      callback(new FormData(this.root));
    });
    return this;
  }

  render(): HTMLElement {
    return this.children([this.#content, this.#actions]).root;
  }

  setContent(content: Component | Component[]) {
    this.#content.children(content);
    return this;
  }

  setMethod(method: 'DELETE' | 'GET' | 'POST' | 'PUT') {
    this.setAttribute('method', method);
    return this;
  }
}
