import type { TypographyBaseProps } from '@/components/ui/typography.ts';

export function TypographyH1({ children }: TypographyBaseProps) {
  return <h2 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">{children}</h2>;
}
