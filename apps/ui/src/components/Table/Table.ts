import './table.css';
import type { CanBeRerendered, Component } from '../../types/component.ts';
import { removeChildren } from '../../utils/removeChildren.ts';
import { BaseComponent } from '../BaseComponent/BaseComponent.ts';
import { Button } from '../Button/Button.ts';
import { columnClassNames, rowActionClassNames } from './constants.ts';
import { ColumnAlign, type ColumnDefinition, type RowAction, RowActionVariant } from './types.ts';

type TableProps<T> = {
  columns: ColumnDefinition<T>[];
  hideHeader?: boolean;
  rowActions?: RowAction<T>[];
};

export class Table<T> extends BaseComponent implements CanBeRerendered<T> {
  #body: Component;
  #header: Component | null;

  #columns: ColumnDefinition<T>[];
  #data: T[];
  #rowActions: RowAction<T>[];

  constructor({ columns, hideHeader, rowActions }: TableProps<T>) {
    super('table');
    this.addClass('Table-root');

    this.#columns = columns;
    this.#data = [];
    this.#rowActions = rowActions ?? [];

    const headerCells = columns.map(column => new BaseComponent('th').setTextContent(column.label));
    const headerRow = new BaseComponent('tr').children(headerCells);

    this.#header = hideHeader ? null : new BaseComponent('thead').children(headerRow);
    this.#body = new BaseComponent('tbody');
  }

  render(): HTMLElement {
    return this.children([...(this.#header ? [this.#header] : []), this.#body]).root;
  }

  renderData() {
    const rows: Component[] = [];

    for (const datum of this.#data) {
      const columns = this.#renderColumns(datum);
      const rowActions = this.#renderRowActions(datum);

      rows.push(new BaseComponent('tr').children([...columns, rowActions]));
    }

    removeChildren(this.#body.root);
    this.#body.children(rows);
  }

  setData(data: T[]) {
    this.#data = data;
    this.renderData();
    return this;
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
      const isDisabled = typeof action.isDisabled === 'boolean' ? action.isDisabled : action.isDisabled?.(datum);
      const isHidden = typeof action.isHidden === 'boolean' ? action.isHidden : action.isHidden?.(datum);

      if (isHidden) {
        continue;
      }

      const button = new Button({ icon: action.icon, text: action.label })
        .addClasses(['Table-rowAction', className])
        .onClick(() => action.onClick(datum))
        .setStatus(isDisabled ? 'disabled' : 'enabled');

      rowActions.push(button);
    }

    return actions.children(rowActions);
  }
}
