import './eventsCell.css';
import type { SuccessApi } from '@pk/types/api.js';
import type { EnrichedEventApi, EventApi } from '@pk/types/event.js';
import { client, sessionService } from '../../../main.ts';
import type { Component } from '../../../types/component.ts';
import { DateFormatter } from '../../../utils/DateFormatter.ts';
import { withNotification } from '../../../utils/withNotification.ts';
import { BaseComponent } from '../../BaseComponent/BaseComponent.ts';
import { Button } from '../../Button/Button.ts';
import { Typography } from '../../Typography/Typography.ts';

export class EventsCell extends BaseComponent {
  #date: Component;
  #events: Component[];
  #eventsContainer: Component;

  constructor(date: Date, events: EnrichedEventApi[], onDelete: () => void) {
    super('div');
    this.addClass('EventsCell-root').setAttribute('data-date-id', new DateFormatter('date').formatter.format(date));

    this.#date = new Typography({ text: new DateFormatter('daymonth').formatter.format(date) });
    this.#events = events.map(event => new Event(event, onDelete));
    this.#eventsContainer = new BaseComponent('div').addClass('EventsCell-events');
  }

  render(): HTMLElement {
    return this.children([this.#date, this.#eventsContainer.children(this.#events)]).root;
  }
}

class Event extends BaseComponent {
  #detailsContainer: Component;
  #timeContainer: Component;

  #description: Component | null;
  #deleteButton: Component | null;
  #location: Component | null;
  #title: Component;
  #time: Component;
  #timeMobile: Component;

  constructor(event: EnrichedEventApi, onDelete: () => void) {
    super('div');
    this.addClass('Event-root');

    const hasPermissionToDelete = sessionService.hasPermission('event', 'delete', { calendar: event.calendar, event });
    const timeFormatter = new DateFormatter('time');
    const parsedEndDate = DateFormatter.parseDate(event.endDate);
    const parsedStartDate = DateFormatter.parseDate(event.startDate);
    const time = `${timeFormatter.formatter.format(parsedStartDate)} - ${timeFormatter.formatter.format(
      parsedEndDate,
    )}`;

    this.#detailsContainer = new BaseComponent('div').addClass('Event-details');
    this.#timeContainer = new BaseComponent('div').addClass('Event-time');
    this.#description = event.description
      ? new Typography({ text: event.description, variant: 'body1' }).addClass('Event-secondary-text')
      : null;

    this.#deleteButton = hasPermissionToDelete
      ? new Button({ icon: 'delete_forever', text: 'Delete' })
          .addClass('Event-delete-button')
          .onClick(async () => {
            await this.#onDelete(event);
            onDelete();
          })
          .setFitContentWith()
      : null;

    this.#location = event.location
      ? new Typography({ text: event.location, variant: 'body2' }).addClass('Event-secondary-text')
      : null;

    this.#title = new Typography({ text: event.title, variant: 'h5' });
    this.#time = new Typography({ text: time });
    this.#timeMobile = new Typography({ text: time }).addClass('Event-mobile-time');
  }

  render(): HTMLElement {
    const details: Component[] = [this.#title, this.#timeMobile];

    if (this.#description) {
      details.push(this.#description);
    }

    if (this.#location) {
      details.push(this.#location);
    }

    if (this.#deleteButton) {
      details.push(this.#deleteButton);
    }

    return this.children([this.#timeContainer.children([this.#time]), this.#detailsContainer.children(details)]).root;
  }

  async #onDelete(event: EventApi) {
    await withNotification({
      errorMessage: 'Failed to delete event.',
      promise: client.delete<SuccessApi>(`/v1/event?uid=${event.uid}`),
      successMessage: () => `Event ${event.title} (${event.uid}) deleted successfully.`,
    });
  }
}
