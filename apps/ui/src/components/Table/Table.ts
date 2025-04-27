import './table.css';
import type { CanBeRerendered, Component } from '../../types/component.ts';
import { removeChildren } from '../../utils/removeChildren.ts';
import { BaseComponent } from '../BaseComponent/BaseComponent.ts';
import { Button } from '../Button/Button.ts';
import { rowActionClassNames } from './constants.ts';
import { type ColumnDefinition, type RowAction, RowActionVariant } from './types.ts';

type TableProps<T> = {
  columns: ColumnDefinition<T>[];
  rowActions?: RowAction<T>[];
};

export class Table<T> extends BaseComponent implements CanBeRerendered {
  #body: Component;
  #header: Component;

  #columns: ColumnDefinition<T>[];
  #rowActions: RowAction<T>[];

  constructor({ columns, rowActions }: TableProps<T>) {
    super('table');
    this.addClass('Table-root');

    this.#columns = columns;
    this.#rowActions = rowActions ?? [];

    const headerCells = columns.map(column => new BaseComponent('th').setTextContent(column.label));
    const headerRow = new BaseComponent('tr').children(headerCells);

    this.#header = new BaseComponent('thead').children(headerRow);
    this.#body = new BaseComponent('tbody');
  }

  render(): HTMLElement {
    return this.children([this.#header, this.#body]).root;
  }

  renderContent(data: T[]) {
    const rows: Component[] = [];

    for (const datum of data) {
      const cells = this.#columns.map(column => new BaseComponent('td').children(column.render(datum)));

      const rowActions = this.#rowActions.map(action => {
        const variant = action.variant ?? RowActionVariant.Primary;
        const className = rowActionClassNames[variant];

        const button = new Button({ text: action.label })
          .addClasses(['Table-rowAction', className])
          .onClick(() => action.onClick(datum));

        const isDisabled = typeof action.isDisabled === 'boolean' ? action.isDisabled : action.isDisabled?.(datum);

        if (isDisabled) {
          button.setDisabled();
        }

        return button;
      });

      rows.push(new BaseComponent('tr').children([...cells, ...rowActions]));
    }

    removeChildren(this.#body.root);
    this.#body.children(rows);
  }
}
