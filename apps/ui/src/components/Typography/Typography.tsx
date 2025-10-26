import { TypographyH1 } from '@/components/ui/typographyH1.tsx';
import { TypographyH2 } from '@/components/ui/typographyH2.tsx';
import { TypographyH4 } from '@/components/ui/typographyH4.tsx';
import { TypographyMuted } from '@/components/ui/typographyMuted.tsx';
import { TypographyP } from '@/components/ui/typographyP.tsx';
import type { ConstValues } from '@pk/types/helpers.js';
import type { ReactNode } from 'react';

export const typographyVariant = {
  H1: 'h1',
  H2: 'h2',
  H3: 'h3',
  H4: 'h4',
  Muted: 'muted',
  P: 'p',
} as const;
export type TypographyVariant = ConstValues<typeof typographyVariant>;

type TypographyProps = {
  children?: ReactNode;
  className?: string;
  variant?: TypographyVariant;
};

export const Typography = ({ children, className, variant = typographyVariant.P }: TypographyProps) => {
  const Component = getTypographyComponent(variant);

  return <Component className={className}>{children}</Component>;
};

const getTypographyComponent = (variant: TypographyVariant) => {
  switch (variant) {
    case typographyVariant.H1:
      return TypographyH1;
    case typographyVariant.H2:
      return TypographyH2;
    case typographyVariant.H3:
      return TypographyH4;
    case typographyVariant.H4:
      return TypographyH4;
    case typographyVariant.Muted:
      return TypographyMuted;
    default:
      return TypographyP;
  }
};
