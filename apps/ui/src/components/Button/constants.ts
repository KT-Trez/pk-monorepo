import type { ButtonVariants } from './types.ts';

export const buttonClassNames: Record<ButtonVariants, string> = {
  contained: 'Button-contained',
  icon: 'Button-icon',
  outlined: 'Button-outlined',
} as const;
