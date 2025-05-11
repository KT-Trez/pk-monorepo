import type { Collection } from '@pk/server/src/components/response/Collection.ts';
import type { EnrichedCalendarApi } from '@pk/types/calendar.js';
import { BaseComponent } from '../../../components/BaseComponent/BaseComponent.ts';
import { ListPageContent } from '../../../components/PageContent/ListPageContent.ts';
import { PageHeader } from '../../../components/PageHeader/PageHeader.ts';
import { Table } from '../../../components/Table/Table.ts';
import { client, notifier } from '../../../main.ts';
import { ApiService } from '../../../services/ApiService.ts';
import type { Component } from '../../../types/component.ts';
import type { SetState, SubscribeState } from '../../../types/useState.ts';
import { useState } from '../../../utils/useState.ts';
import { useCalendarPageActions } from './hooks/useCalendarPageActions.ts';
import { useCalendarRowActions } from './hooks/useCalendarRowActions.ts';
import { useCalendarTableColumns } from './hooks/useCalendarTableColumns.ts';

export class CalendarsPage extends BaseComponent {
  #content: Component;
  #header: Component;
  #table: Table<EnrichedCalendarApi>;

  #setCalendars: SetState<EnrichedCalendarApi[]>;
  #subscribe: SubscribeState<EnrichedCalendarApi[]>;

  constructor() {
    super('div');
    this.setStyle({ height: '100%' });

    const [setCalendars, subscribe] = useState<EnrichedCalendarApi[]>([]);
    this.#setCalendars = setCalendars;
    this.#subscribe = subscribe;

    const actions = useCalendarPageActions(this.#setCalendars);
    const columns = useCalendarTableColumns();
    const rowActions = useCalendarRowActions(this.#setCalendars);

    this.#table = new Table({ columns, rowActions });
    this.#header = new PageHeader('Calendars');
    this.#content = new ListPageContent({ actions }).setContent(this.#table);

    this.#subscribe(calendars => this.#table.setData(calendars));
    this.#onRender();
  }

  render(): HTMLElement {
    return this.children([this.#header, this.#content]).root;
  }

  async #onRender() {
    try {
      const { items } = await client.get<Collection<EnrichedCalendarApi>>(
        `/v1/calendars?limit=${ApiService.DEFAULT_LIMIT}`,
      );
      this.#setCalendars(items);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch calendars.';
      notifier.notify({ severity: 'error', text: message });
    }
  }
}
