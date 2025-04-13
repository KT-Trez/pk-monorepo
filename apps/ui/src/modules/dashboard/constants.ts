import type { NavCategory } from '../../components/Nav/types.ts';

export const navConfig: NavCategory[] = [
  {
    items: [
      {
        href: '/admin/permissions',
        name: 'Permissions',
      },
      {
        href: '/admin/users',
        name: 'Users',
      },
    ],
    name: 'Admin',
  },
  {
    items: [
      {
        href: '/home/events',
        name: 'Events',
      },
      {
        href: '/home/schedule',
        name: 'Schedule',
      },
    ],
    name: 'Home',
  },
  {
    items: [
      {
        href: '/settings/account',
        name: 'Account',
      },
    ],
    name: 'Settings',
  },
];
