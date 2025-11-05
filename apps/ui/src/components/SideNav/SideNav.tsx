import { SideNavCategory } from '@/components/SideNav/components/SideNavCategory.tsx';
import type { SideNavConfig } from '@/components/SideNav/types.ts';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { cn } from '@/lib/utils.ts';

type SideNavProps<T extends string> = {
  className?: string;
  config: SideNavConfig<T>;
};

export const SideNav = <T extends string>({ className, config }: SideNavProps<T>) => {
  return (
    <div className={cn('p-4', className)}>
      <Card className="h-full w-full">
        <CardContent className="flex flex-col gap-4 px-4">
          {config.map(category => (
            <SideNavCategory category={category} key={category.name} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
