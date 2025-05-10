import type { Collection } from '@pk/server/src/components/response/Collection.ts';
import type { FullUserApi } from '@pk/types/user.js';
import { BaseComponent } from '../../../components/BaseComponent/BaseComponent.ts';
import { ListPageContent } from '../../../components/PageContent/ListPageContent.ts';
import { PageHeader } from '../../../components/PageHeader/PageHeader.ts';
import { Table } from '../../../components/Table/Table.ts';
import { client, notifier } from '../../../main.ts';
import { ApiService } from '../../../services/ApiService.ts';
import type { CanBeRerendered, Component } from '../../../types/component.ts';
import type { SetState, SubscribeState } from '../../../types/useState.ts';
import { useState } from '../../../utils/useState.ts';
import { usePageActions } from './config/usePageActions.ts';
import { useRowActions } from './config/useRowActions.ts';
import { useTableColumns } from './config/useTableColumns.ts';

export class UsersPage extends BaseComponent {
  #content: Component;
  #header: Component;
  #table: Component & CanBeRerendered<FullUserApi>;

  #setUsers: SetState<FullUserApi[]>;
  #subscribe: SubscribeState<FullUserApi[]>;

  constructor() {
    super('div');
    this.setStyle({ height: '100%' });

    const [setUsers, subscribe] = useState<FullUserApi[]>([]);
    this.#setUsers = setUsers;
    this.#subscribe = subscribe;

    const actions = usePageActions();
    const columns = useTableColumns();
    const rowActions = useRowActions(this.#setUsers);

    this.#table = new Table({ columns, rowActions });
    this.#header = new PageHeader('Users');
    this.#content = new ListPageContent({ actions }).setContent(this.#table);

    this.#subscribe(users => this.#table.setData(users));
    this.#onRender();
  }

  render(): HTMLElement {
    return this.children([this.#header, this.#content]).root;
  }

  async #onRender() {
    try {
      const { items } = await client.get<Collection<FullUserApi>>(`/v1/users?limit=${ApiService.DEFAULT_LIMIT}`);
      this.#setUsers(items);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch users.';
      notifier.notify({ severity: 'error', text: message });
    }
  }
}
