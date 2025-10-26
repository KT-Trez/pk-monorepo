import type { TypographyBaseProps } from '@/components/ui/typography.ts';

export function TypographyMuted({ children }: TypographyBaseProps) {
  return <p className="text-muted-foreground text-sm">{children}</p>;
}
