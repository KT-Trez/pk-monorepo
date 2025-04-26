import type { ButtonVariant } from './types.ts';

export const buttonClassNames: Record<ButtonVariant, string> = {
  contained: 'Button-contained',
  outlined: 'Button-outlined',
} as const;
