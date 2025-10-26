import { Typography } from '@/components/Typography/Typography.tsx';
import type { SideNavItem as ISideNavItem } from '../types.ts';

type SideNavItemProps = {
  item: ISideNavItem;
};

export const SideNavItem = ({ item }: SideNavItemProps) => {
  if (item.isHidden) {
    return null;
  }

  return <Typography>{item.name}</Typography>;
};
