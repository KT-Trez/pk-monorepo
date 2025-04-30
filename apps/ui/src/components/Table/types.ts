import type { ConstValues } from '@pk/types/helpers.js';
import type { Component } from '../../types/component.ts';

export type ColumnDefinition<T> = {
  align?: 'left' | 'center' | 'right';
  label: string;
  render: (item: T) => Component;
};

export const ColumnAlign = {
  Left: 'left',
  Center: 'center',
  Right: 'right',
} as const;
export type ColumnAligns = ConstValues<typeof ColumnAlign>;

export type RowAction<T> = {
  icon?: string;
  isDisabled?: boolean | ((datum: T) => boolean);
  isHidden?: boolean | ((datum: T) => boolean);
  label: string;
  onClick: (datum: T) => void;
  variant?: RowActionVariants;
};

export const RowActionVariant = {
  Danger: 'danger',
  Info: 'info',
  Primary: 'primary',
  Success: 'success',
  Warning: 'warning',
} as const;
export type RowActionVariants = ConstValues<typeof RowActionVariant>;
