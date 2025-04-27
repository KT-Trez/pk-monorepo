import type { ColumnAligns, RowActionVariants } from './types.ts';

export const columnClassNames: Record<ColumnAligns, string> = {
  center: 'Table-column--center',
  left: 'Table-column--left',
  right: 'Table-column--right',
} as const;

export const rowActionClassNames: Record<RowActionVariants, string> = {
  danger: 'Table-rowAction--danger',
  info: 'Table-rowAction--info',
  primary: 'Table-rowAction--primary',
  success: 'Table-rowAction--success',
  warning: 'Table-rowAction--warning',
} as const;
