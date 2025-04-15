import type { TypographyVariants } from './types.ts';

export const typographyClassNames: Record<TypographyVariants, string> = {
  body1: 'typography-body-1',
  body2: 'typography-body-2',
  button: 'typography-button',
  caption: 'typography-caption',
  h1: 'typography-h1',
  h2: 'typography-h2',
  h3: 'typography-h3',
  h4: 'typography-h4',
  h5: 'typography-h5',
  h6: 'typography-h6',
} as const;

export const typographyTagNames: Record<TypographyVariants, keyof HTMLElementTagNameMap> = {
  body1: 'p',
  body2: 'p',
  button: 'button',
  caption: 'p',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
} as const;
