export type NavCategory = {
  isHidden?: boolean;
  items: NavCategoryItem[];
  name: string;
};

export type NavCategoryItem = {
  href: string;
  name: string;
  isHidden?: boolean;
};
