import type { EventApi, EventApiCreatePayload } from '@pk/types/event.js';
import type { Option } from '@pk/types/option.js';
import { BaseComponent } from '../../../components/BaseComponent/BaseComponent.ts';
import { FormSection } from '../../../components/Form/FormSection.ts';
import { FormPageContent } from '../../../components/PageContent/FormPageContent.ts';
import { PageHeader } from '../../../components/PageHeader/PageHeader.ts';
import { Select } from '../../../components/Select/Select.ts';
import { TextField } from '../../../components/TextField/TextField.ts';
import { client, notifier } from '../../../main.ts';
import type { Component } from '../../../types/component.ts';
import { formatDateToFormValidation } from '../../../utils/formatDateToFormValidation.ts';
import { navigate } from '../../../utils/navigate.ts';
import { withNotification } from '../../../utils/withNotification.ts';

export class EventFormPage extends BaseComponent {
  #content: Component;
  #header: Component;

  #calendarSelect: Select<Option>;

  constructor() {
    super('div');
    this.setStyle({ height: '100%' });

    this.#calendarSelect = new Select<Option>('calendarUid', {
      getOptionLabel: option => option.name,
      getOptionValue: option => option.uid,
    })
      .setFullWidth()
      .setLabel('Calendar*')
      .setRequired();

    const now = new Date();
    const minDateTime = formatDateToFormValidation(now);

    const detailsSectionFields: Component[] = [
      this.#calendarSelect,
      new TextField('title').setFullWidth().setLabel('Title*').setPlaceholder('Enter title').setRequired(),
      new TextField('description')
        .addIcon('short_text', 'start')
        .setFullWidth()
        .setLabel('Description')
        .setPlaceholder('Enter description'),
      new TextField('location')
        .addIcon('map', 'start')
        .setFullWidth()
        .setLabel('Location')
        .setPlaceholder('Enter location'),
    ];

    const timeAndDateSectionFields: Component[] = [
      new TextField('startDate')
        .addIcon('event', 'start')
        .setFullWidth()
        .setInputAttribute('min', minDateTime)
        .setLabel('Start date*')
        .setPlaceholder('Select start date')
        .setRequired()
        .setType('datetime-local'),
      new TextField('endDate')
        .addIcon('event', 'start')
        .setFullWidth()
        .setInputAttribute('min', minDateTime)
        .setLabel('End date*')
        .setPlaceholder('Select end date')
        .setRequired()
        .setType('datetime-local'),
    ];

    this.#header = new PageHeader('Create new event');
    this.#content = new FormPageContent({ onCancel: this.#onCancel })
      .onSubmit(this.#onSubmit.bind(this))
      .setContent([
        new FormSection({ fields: detailsSectionFields, title: 'Details' }),
        new FormSection({ fields: timeAndDateSectionFields, title: 'Time and date' }),
      ])
      .setMethod('POST');

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
      errorMessage: 'Failed to fetch calendar options.',
      onSuccess: options => this.#calendarSelect.setData(options),
      promise: client.get<Option[]>('/v1/options/calendar'),
    });
  }

  async #onSubmit(formData: FormData) {
    if (!this.#onValidation(formData)) {
      return;
    }

    const description = <string>formData.get('description');
    const location = <string>formData.get('location');

    const payload: EventApiCreatePayload = {
      calendarUid: <string>formData.get('calendarUid'),
      description: description ? description : undefined,
      endDate: new Date(<string>formData.get('endDate')).toISOString(),
      location: location ? location : undefined,
      startDate: new Date(<string>formData.get('startDate')).toISOString(),
      title: <string>formData.get('title'),
    };

    await withNotification({
      errorMessage: 'Failed to create event.',
      onSuccess: () => navigate('#/home/events'),
      promise: client.post<EventApi, EventApiCreatePayload>('/v1/event', payload),
      successMessage: event => `Event ${event.title} (${event.uid}) created successfully.`,
    });
  }

  #onValidation(formData: FormData) {
    const startDateString = <string>formData.get('startDate');
    const endDateString = <string>formData.get('endDate');

    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    if (startDate >= endDate) {
      notifier.notify({ text: 'Start date must be before end date.', severity: 'error' });
      return false;
    }

    const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    if (startDateOnly.getTime() !== endDateOnly.getTime()) {
      notifier.notify({ text: 'Events cannot span multiple days.', severity: 'error' });
      return false;
    }

    return true;
  }
}
