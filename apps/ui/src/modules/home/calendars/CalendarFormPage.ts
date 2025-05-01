import type { EnrichedCalendarApi, EnrichedCalendarCreateApiPayload } from '@pk/types/calendar.js';
import { BaseComponent } from '../../../components/BaseComponent/BaseComponent.ts';
import { Checkbox } from '../../../components/Checkbox/Checkbox.ts';
import { FormSection } from '../../../components/Form/FormSection.ts';
import { FormPageContent } from '../../../components/PageContent/FormPageContent.ts';
import { PageHeader } from '../../../components/PageHeader/PageHeader.ts';
import { TextField } from '../../../components/TextField/TextField.ts';
import { client, notifier } from '../../../main.ts';
import type { Component } from '../../../types/component.ts';
import { navigate } from '../../../utils/navigate.ts';

export class CalendarFormPage extends BaseComponent {
  #content: Component;
  #header: Component;

  constructor() {
    super('div');
    this.setStyle({ height: '100%' });

    const detailsSectionFields: Component[] = [
      new TextField('name').setFullWidth().setLabel('Name*').setPlaceholder('Enter name').setRequired(),
    ];

    const visibilitySectionFields: Component[] = [new Checkbox({ label: 'Public', name: 'isPublic' })];

    this.#header = new PageHeader('Create new calendar');
    this.#content = new FormPageContent({ onCancel: this.#onCancel })
      .onSubmit(this.#onSubmit)
      .setContent([
        new FormSection({ fields: detailsSectionFields, title: 'Details' }),
        new FormSection({ fields: visibilitySectionFields, title: 'Visibility' }),
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
    const payload: EnrichedCalendarCreateApiPayload = {
      isPublic: formData.get('isPublic') === 'on',
      name: formData.get('name') as string,
    };

    try {
      const calendar = await client.post<EnrichedCalendarApi, EnrichedCalendarCreateApiPayload>(
        '/v1/calendar',
        payload,
      );

      navigate('#/home/calendars');
      const message = `Calendar ${calendar.name} (${calendar.uid}) created successfully.`;
      notifier.notify({ text: message, severity: 'success' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create calendar';
      notifier.notify({ text: message, severity: 'error' });
    }
  }
}
