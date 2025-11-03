import { Link } from '@tanstack/react-router';
import { Typography } from '@/components/Typography/Typography.tsx';
import type { SideNavItem as ISideNavItem } from '../types.ts';

type SideNavItemProps<T extends string> = {
  item: ISideNavItem<T>;
};

export const SideNavItem = <T extends string>({ item }: SideNavItemProps<T>) => {
  if (item.isHidden) {
    return null;
  }

  return (
    <Typography Component={Link} href={item.href}>
      {item.name}
    </Typography>
  );
};
