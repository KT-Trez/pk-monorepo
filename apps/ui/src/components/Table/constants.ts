import type { RowActionVariants } from './types.ts';

export const rowActionClassNames: Record<RowActionVariants, string> = {
  danger: 'Table-rowAction--danger',
  info: 'Table-rowAction--info',
  primary: 'Table-rowAction--primary',
  success: 'Table-rowAction--success',
  warning: 'Table-rowAction--warning',
} as const;
