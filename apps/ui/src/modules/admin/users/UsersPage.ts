import type { Collection } from '@pk/server/src/components/response/Collection.ts';
import type { FullUserApi } from '@pk/types/user.js';
import { BaseComponent } from '../../../components/BaseComponent/BaseComponent.ts';
import { ListPageContent } from '../../../components/PageContent/ListPageContent.ts';
import { PageHeader } from '../../../components/PageHeader/PageHeader.ts';
import { Table } from '../../../components/Table/Table.ts';
import { client } from '../../../main.ts';
import type { Component } from '../../../types/component.ts';
import { usePageActions } from './config/usePageActions.ts';
import { useTableColumns } from './config/useTableColumns.ts';

export class UsersPage extends BaseComponent {
  #content: Component;
  #header: Component;
  #table: Table<FullUserApi>;

  constructor() {
    super('div');
    this.setStyle({ height: '100%' }).#onRender();

    const actions = usePageActions();
    const columns = useTableColumns();

    this.#table = new Table({ columns, data: [] });
    this.#header = new PageHeader('Users');
    this.#content = new ListPageContent({ actions }).setContent(this.#table);
  }

  render(): HTMLElement {
    return this.children([this.#header, this.#content]).root;
  }

  async #onRender() {
    const { items } = await client.get<Collection<FullUserApi>>('/v1/users');
    this.#table.renderContent(items);
  }
}
