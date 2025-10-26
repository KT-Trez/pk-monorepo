export type SideNavConfig<T extends string> = SideNavCategory<T>[];

export type SideNavCategory<T extends string> = {
  isHidden?: boolean;
  items: SideNavItem<T>[];
  name: string;
};

export type SideNavItem<T extends string> = {
  href: T;
  name: string;
  isHidden?: boolean;
};
