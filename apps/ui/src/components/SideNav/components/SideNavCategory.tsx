import { SideNavItem } from '@/components/SideNav/components/SideNavItem.tsx';
import { Typography } from '@/components/Typography/Typography.tsx';
import type { SideNavCategory as ISideNavCategory } from '../types.ts';

type SideNavCategoryProps<T extends string> = {
  category: ISideNavCategory<T>;
};

export const SideNavCategory = <T extends string>({ category }: SideNavCategoryProps<T>) => {
  if (category.isHidden) {
    return null;
  }

  return (
    <div>
      <Typography className="text-primary" variant="h4">
        {category.name}
      </Typography>

      <div className="flex flex-col pl-2">
        {category.items.map(item => (
          <SideNavItem item={item} key={item.name} />
        ))}
      </div>
    </div>
  );
};
