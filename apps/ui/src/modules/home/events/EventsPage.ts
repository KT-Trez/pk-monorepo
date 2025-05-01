import type { Collection } from '@pk/server/src/components/response/Collection.ts';
import type { EnrichedEventApi } from '@pk/types/event.js';
import { BaseComponent } from '../../../components/BaseComponent/BaseComponent.ts';
import { ListPageContent } from '../../../components/PageContent/ListPageContent.ts';
import { PageHeader } from '../../../components/PageHeader/PageHeader.ts';
import { Table } from '../../../components/Table/Table.ts';
import { client } from '../../../main.ts';
import { ApiService } from '../../../services/ApiService.ts';
import type { Component } from '../../../types/component.ts';
import type { SetState, SubscribeState } from '../../../types/useState.ts';
import { useState } from '../../../utils/useState.ts';
import { withNotification } from '../../../utils/withNotification.ts';
import { useEventPageActions } from './hooks/useEventPageActions.ts';
import { useEventTableColumns } from './hooks/useEventTableColumns.ts';
import type { EventsGroupedByDay } from './types.ts';

export class EventsPage extends BaseComponent {
  #content: ListPageContent;
  #header: Component;
  #table: Table<EventsGroupedByDay>;

  #setEvents: SetState<EventsGroupedByDay[]>;
  #subscribeEvents: SubscribeState<EventsGroupedByDay[]>;

  constructor() {
    super('div');
    this.setStyle({ height: '100%' });

    const [_, setCalendars, subscribe] = useState<EventsGroupedByDay[]>([]);
    this.#setEvents = setCalendars;
    this.#subscribeEvents = subscribe;

    const actions = useEventPageActions();
    const columns = useEventTableColumns(this.#onRender.bind(this));

    this.#table = new Table({ columns, hideHeader: true });
    this.#header = new PageHeader('Calendars');
    this.#content = new ListPageContent({ actions }).setContent(this.#table);

    this.#subscribeEvents(calendars => this.#table.setData(calendars));
    this.#onRender();
  }

  render(): HTMLElement {
    return this.children([this.#header, this.#content]).root;
  }

  async #onRender() {
    const collection = await withNotification({
      promise: client.get<Collection<EnrichedEventApi>>(`/v1/events?limit=${ApiService.DEFAULT_LIMIT}`),
      errorMessage: 'Failed to fetch events.',
    });

    const events = collection?.items ?? [];

    const eventsByDate = events.reduce<Record<string, EventsGroupedByDay>>((acc, event) => {
      const date = new Date(event.startDate);
      date.setHours(0, 0, 0, 0); // normalize the date to midnight
      const dateString = date.toISOString();

      if (acc[dateString]) {
        acc[dateString].events.push(event);
      } else {
        acc[dateString] = { date, events: [event] };
      }

      return acc;
    }, {});

    this.#setEvents(Object.values(eventsByDate));
  }
}
