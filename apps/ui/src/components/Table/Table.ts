import './table.css';
import type { CanBeRerendered, Component } from '../../types/component.ts';
import { removeChildren } from '../../utils/removeChildren.ts';
import { BaseComponent } from '../BaseComponent/BaseComponent.ts';
import { Button } from '../Button/Button.ts';
import { columnClassNames, rowActionClassNames } from './constants.ts';
import { ColumnAlign, type ColumnDefinition, type RowAction, RowActionVariant } from './types.ts';

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
      const columns = this.#renderColumns(datum);
      const rowActions = this.#renderRowActions(datum);

      rows.push(new BaseComponent('tr').children([...columns, rowActions]));
    }

    removeChildren(this.#body.root);
    this.#body.children(rows);
  }

  #renderColumns(datum: T) {
    const columns: Component[] = [];

    for (const column of this.#columns) {
      const align = column.align ?? ColumnAlign.Left;
      const className = columnClassNames[align];

      const cell = new BaseComponent('td').addClass(className).children(column.render(datum));

      columns.push(cell);
    }

    return columns;
  }

  #renderRowActions(datum: T) {
    const actions = new BaseComponent('div').addClass('Table-rowActions');
    const rowActions: Component[] = [];

    for (const action of this.#rowActions) {
      const variant = action.variant ?? RowActionVariant.Primary;
      const className = rowActionClassNames[variant];

      const button = new Button({ icon: action.icon, text: action.label })
        .addClasses(['Table-rowAction', className])
        .onClick(() => action.onClick(datum));

      const isDisabled = typeof action.isDisabled === 'boolean' ? action.isDisabled : action.isDisabled?.(datum);

      if (isDisabled) {
        button.setDisabled();
      }

      rowActions.push(button);
    }

    return actions.children(rowActions);
  }
}
