import type { FC, ReactNode } from 'react';
import { typographyClassName, typographyComponent } from '@/components/Typography/constants.ts';
import { type TypographyVariant, typographyVariant } from '@/components/Typography/types.ts';
import { cn } from '@/lib/utils.ts';

type TypographyProps<TComponentProps> = {
  Component?: FC<TComponentProps>;
  children?: ReactNode;
  className?: string;
  variant?: TypographyVariant;
} & Partial<TComponentProps>;

export const Typography = <TComponentProps,>({
  Component,
  children,
  className,
  variant = typographyVariant.P,
  ...rest
}: TypographyProps<TComponentProps>) => {
  const TypographyComponent = Component ?? typographyComponent[variant];
  const defaultClassName = typographyClassName[variant];

  return (
    // @ts-expect-error - because `typographyComponent` is static, a generic type is not inferred and `rest` is invalid
    <TypographyComponent {...rest} className={cn(defaultClassName, className)}>
      {children}
    </TypographyComponent>
  );
};
