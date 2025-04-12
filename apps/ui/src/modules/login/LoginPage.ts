import { BaseComponent } from '../../components/BaseComponent.ts';
import { Button } from '../../components/Button.ts';
import { Form } from '../../components/Form.ts';
import { Logo } from '../../components/Logo.ts';
import { TextField } from '../../components/TextField.ts';
import type { Component } from '../../types/component.ts';

export class LoginPage extends BaseComponent {
  #email: Component;
  #form: Component<'form'>;
  #logo: Component;
  #password: Component;
  #submit: Component;

  constructor() {
    super('div');

    this.addClass('FullPage-root');

    this.#email = new TextField('email')
        .addIcon('email', 'start')
        .setFullWidth()
        // .setLabel('Email')
        .setPlaceholder('Enter email')
        .setRequired()
        .setType('email');

    this.#form = new Form().onSubmit(this.#handleFormSubmit).setMethod('POST');

    this.#logo = new Logo(100);

    this.#password = new TextField('password')
        .addIcon('lock', 'start')
        .setFullWidth()
        // .setLabel('Password')
        .setPlaceholder('Enter password')
        .setRequired()
        .setType('password');

    this.#submit = new Button('Submit').setFullWidth().setType('submit');
  }

  render(): HTMLElement {
    return this.children(this.#form.children([this.#logo, this.#email, this.#password, this.#submit])).root;
  }

  #handleFormSubmit(formData: FormData) {
    const email = formData.get('email');
    const password = formData.get('password');

    console.log({ email, password });
  }
}
