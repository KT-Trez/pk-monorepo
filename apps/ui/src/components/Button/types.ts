import type { ConstValues } from '@pk/types/helpers.js';

export const ButtonVariant = {
  Contained: 'contained',
  Icon: 'icon',
  Outlined: 'outlined',
} as const;
export type ButtonVariants = ConstValues<typeof ButtonVariant>;
