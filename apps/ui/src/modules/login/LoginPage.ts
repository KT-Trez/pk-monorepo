import './loginPage.css';
import type { EnrichedSessionApi } from '@pk/types/session.js';
import { BaseComponent } from '../../components/BaseComponent/BaseComponent.ts';
import { Button } from '../../components/Button/Button.ts';
import { Form } from '../../components/Form/Form.ts';
import { Logo } from '../../components/Logo/Logo.ts';
import { TextField } from '../../components/TextField/TextField.ts';
import { client, notifier, store } from '../../main.ts';
import type { Component } from '../../types/component.ts';
import { navigate } from '../../utils/navigate.ts';

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

    this.#logo = new Logo('100px');

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

  async #handleFormSubmit(formData: FormData) {
    const email = formData.get('email');
    const password = formData.get('password');

    if (email === null || password === null) {
      return console.error('"email" and "password" are required');
    }

    try {
      const session = await client.post<EnrichedSessionApi>('/v1/session', { email, password });

      store.set('session', session);
      navigate('#/home/events');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      notifier.notify({ text: message, severity: 'error' });
    }
  }
}
