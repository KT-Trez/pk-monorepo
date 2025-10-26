export type SideNavConfig = SideNavCategory[];

export type SideNavCategory = {
  isHidden?: boolean;
  items: SideNavItem[];
  name: string;
};

export type SideNavItem = {
  href: string;
  name: string;
  isHidden?: boolean;
};
