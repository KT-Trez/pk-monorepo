import type { ButtonVariant } from '../Button/types.ts';

export type ListPageAction = {
  label: string;
  onClick: () => void;
  variant?: typeof ButtonVariant.Contained | typeof ButtonVariant.Outlined;
};
