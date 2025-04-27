import { type EnrichedUserApiCreatePayload, type FullUserApi, UserRole } from '@pk/types/user.js';
import { BaseComponent } from '../../../components/BaseComponent/BaseComponent.ts';
import { Checkbox } from '../../../components/Checkbox/Checkbox.ts';
import { FormSection } from '../../../components/Form/FormSection.ts';
import { FormPageContent } from '../../../components/PageContent/FormPageContent.ts';
import { PageHeader } from '../../../components/PageHeader/PageHeader.ts';
import { TextField } from '../../../components/TextField/TextField.ts';
import { client, notifier } from '../../../main.ts';
import type { Component } from '../../../types/component.ts';
import { navigate } from '../../../utils/navigate.ts';

export class UserCreateForm extends BaseComponent {
  #content: Component;
  #header: Component;

  constructor() {
    super('div');
    this.setStyle({ height: '100%' });

    const detailsSectionFields: Component[] = [
      new TextField('name').setFullWidth().setLabel('Name*').setPlaceholder('Enter name').setRequired(),
      new TextField('surname').setFullWidth().setLabel('Surname*').setPlaceholder('Enter surname').setRequired(),
    ];

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
    ];

    const rolesSectionFields: Component[] = [
      new Checkbox({ label: 'Admin', name: 'admin' }),
      new Checkbox({ checked: true, label: 'Member', name: 'member' }).setDisabled(),
    ];

    this.#header = new PageHeader('Create new user');
    this.#content = new FormPageContent({ onCancel: this.#onCancel })
      .onSubmit(this.#onSubmit)
      .setContent([
        new FormSection({ fields: detailsSectionFields, title: 'Details' }),
        new FormSection({ fields: securitySectionFields, title: 'Security' }),
        new FormSection({ fields: rolesSectionFields, title: 'Roles' }),
      ])
      .setMethod('POST');
  }

  render(): HTMLElement {
    return this.children([this.#header, this.#content]).root;
  }

  #onCancel() {
    navigate('#/admin/users');
  }

  async #onSubmit(formData: FormData) {
    const payload: EnrichedUserApiCreatePayload = {
      name: formData.get('name') as string,
      surname: formData.get('surname') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      roles: [...(formData.get('admin') ? [UserRole.Admin] : []), UserRole.Member],
    };

    try {
      const user = await client.post<FullUserApi, EnrichedUserApiCreatePayload>('/v1/user', payload);
      navigate('#/admin/users');
      const message = `User ${user.name} ${user.surname} (${user.uid}) created successfully.`;
      notifier.notify({ text: message, severity: 'success' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      notifier.notify({ text: message, severity: 'error' });
    }
  }
}
