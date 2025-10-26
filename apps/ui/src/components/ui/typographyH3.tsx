import type { TypographyBaseProps } from '@/components/ui/typography.ts';

export function TypographyH3({ children }: TypographyBaseProps) {
  return <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{children}</h3>;
}
