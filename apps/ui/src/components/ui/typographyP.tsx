import type { TypographyBaseProps } from '@/components/ui/typography.ts';
import { cn } from '@/lib/utils.ts';

export function TypographyP({ className, children }: TypographyBaseProps) {
  return <p className={cn('leading-7', className)}>{children}</p>;
}
