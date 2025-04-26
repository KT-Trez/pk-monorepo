import './table.css';
import type { CanBeRerendered, Component } from '../../types/component.ts';
import { removeChildren } from '../../utils/removeChildren.ts';
import { BaseComponent } from '../BaseComponent/BaseComponent.ts';
import type { ColumnDefinition } from './types.ts';

type TableProps<T> = {
  columns: ColumnDefinition<T>[];
  data: T[];
};

export class Table<T> extends BaseComponent implements CanBeRerendered {
  #body: Component;
  #header: Component;

  #columns: ColumnDefinition<T>[];
  #data: T[];

  constructor({ columns, data }: TableProps<T>) {
    super('table');
    this.addClass('Table-root');

    this.#columns = columns;
    this.#data = data;

    const headerCells = columns.map(column => new BaseComponent('th').setTextContent(column.label));
    const headerRow = new BaseComponent('tr').children(headerCells);

    this.#header = new BaseComponent('thead').children(headerRow);
    this.#body = new BaseComponent('tbody');
  }

  render(): HTMLElement {
    const element = this.children([this.#header, this.#body]).root;
    this.renderContent(this.#data);

    return element;
  }

  renderContent(data: T[]) {
    const rows: Component[] = [];

    for (const datum of data) {
      const cells = this.#columns.map(column => new BaseComponent('td').children(column.render(datum)));
      rows.push(new BaseComponent('tr').children(cells));
    }

    removeChildren(this.#body.root);
    this.#body.children(rows);
  }
}
