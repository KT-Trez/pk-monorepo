import type { TypographyVariant } from '@/components/Typography/types.ts';

export const typographyClassName: Record<TypographyVariant, string> = {
  h1: 'scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance',
  h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
  muted: 'text-muted-foreground text-sm',
  p: 'leading-7',
};

export const typographyComponent: Record<TypographyVariant, keyof HTMLElementTagNameMap> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  muted: 'p',
  p: 'p',
};
