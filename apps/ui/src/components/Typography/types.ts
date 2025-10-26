import type { ConstValues } from '@pk/types/helpers.js';

export const typographyVariant = {
  H1: 'h1',
  H2: 'h2',
  H3: 'h3',
  H4: 'h4',
  Muted: 'muted',
  P: 'p',
} as const;
export type TypographyVariant = ConstValues<typeof typographyVariant>;
