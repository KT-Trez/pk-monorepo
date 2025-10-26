import type { TypographyBaseProps } from '@/components/ui/typography.ts';
import { cn } from '@/lib/utils.ts';

export function TypographyH4({ children, className }: TypographyBaseProps) {
  return <h4 className={cn('scroll-m-20 text-xl font-semibold tracking-tight', className)}>{children}</h4>;
}
