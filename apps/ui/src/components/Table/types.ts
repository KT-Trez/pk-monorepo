import type { Component } from '../../types/component.ts';

export type ColumnDefinition<T> = {
  label: string;
  render: (item: T) => Component;
};
