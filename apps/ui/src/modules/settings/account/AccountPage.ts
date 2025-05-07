import type { EnrichedUserApiUpdatePayload, FullUserApi } from '@pk/types/user.js';
import { BaseComponent } from '../../../components/BaseComponent/BaseComponent.ts';
import { FormSection } from '../../../components/Form/FormSection.ts';
import { FormPageContent } from '../../../components/PageContent/FormPageContent.ts';
import { PageHeader } from '../../../components/PageHeader/PageHeader.ts';
import { TextField } from '../../../components/TextField/TextField.ts';
import { client, notifier, sessionService } from '../../../main.ts';
import type { Component } from '../../../types/component.ts';
import { navigate } from '../../../utils/navigate.ts';
import { withNotification } from '../../../utils/withNotification.ts';

export class AccountPage extends BaseComponent {
  #content: Component;
  #header: Component;

  #nameField: TextField;
  #surnameField: TextField;

  constructor() {
    super('div');
    this.setStyle({ height: '100%' });

    this.#nameField = new TextField('name').setDisabled().setFullWidth().setLabel('Name').setPlaceholder('Enter name');
    this.#surnameField = new TextField('surname')
      .setDisabled()
      .setFullWidth()
      .setLabel('Surname')
      .setPlaceholder('Enter surname');

    const detailsSectionFields: Component[] = [this.#nameField, this.#surnameField];

    const securitySectionFields: Component[] = [
      new TextField('email')
        .setFullWidth()
        .setLabel('Email*')
        .setPlaceholder('Enter email')
        .setRequired()
        .setType('email'),
      new TextField('password')
        .setFullWidth()
        .setLabel('Password*')
        .setPlaceholder('Enter password')
        .setRequired()
        .setType('password'),
      new TextField('repeatedPassword')
        .setFullWidth()
        .setLabel('Repeated password*')
        .setPlaceholder('Repeat password')
        .setRequired()
        .setType('password'),
    ];

    this.#header = new PageHeader('Account settings');
    this.#content = new FormPageContent({ onCancel: this.#onCancel })
      .onSubmit(this.#onSubmit.bind(this))
      .setContent([
        new FormSection({ fields: detailsSectionFields, title: 'Details' }),
        new FormSection({ fields: securitySectionFields, title: 'Security' }),
      ])
      .setMethod('PUT');

    this.#onRender();
  }

  render(): HTMLElement {
    return this.children([this.#header, this.#content]).root;
  }

  #onCancel() {
    navigate('#/home/events');
  }

  async #onRender() {
    await withNotification({
      errorMessage: 'Failed to fetch user.',
      onSuccess: user => {
        this.#nameField.setInputAttribute('value', user.name);
        this.#surnameField.setInputAttribute('value', user.surname);
      },
      promise: client.get<FullUserApi>(`/v1/user?uid=${sessionService.session?.user.uid}`),
    });
  }

  async #onSubmit(formData: FormData) {
    if (!this.#onValidation(formData)) {
      return;
    }

    if (!sessionService.session) {
      throw new Error('Session not found.');
    }

    const payload: EnrichedUserApiUpdatePayload = {
      email: <string>formData.get('email'),
      password: <string>formData.get('password'),
      uid: sessionService.session.user.uid,
    };

    await withNotification({
      errorMessage: 'Failed to update account settings.',
      onSuccess: user => {
        sessionService.updateUser(user);
        navigate('#/home/events');
      },
      promise: client.put<FullUserApi, EnrichedUserApiUpdatePayload>('/v1/user', payload),
      successMessage: 'Account settings updated successfully.',
    });
  }

  #onValidation(formData: FormData) {
    const password = <string>formData.get('password');
    const repeatPassword = <string>formData.get('repeatedPassword');

    if (password && password !== repeatPassword) {
      notifier.notify({ text: 'Password* must match the Repeated password*', severity: 'error' });
      return false;
    }

    return true;
  }
}
