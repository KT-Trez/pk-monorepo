import type { ConstValues } from '@pk/types/helpers.js';

export const themeVariant = {
  Dark: 'dark',
  Light: 'light',
  System: 'system',
} as const;
export type ThemeVariant = ConstValues<typeof themeVariant>;

export type ThemeProviderState = {
  setTheme: (theme: ThemeVariant) => void;
  theme: ThemeVariant;
};
