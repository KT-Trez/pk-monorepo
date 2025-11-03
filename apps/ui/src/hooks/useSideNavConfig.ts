import type { FileRoutesByPath } from '@tanstack/react-router';
import { useMemo } from 'react';
import type { SideNavConfig } from '@/components/SideNav/types.ts';

export const useSideNavConfig = () => {
  return useMemo<SideNavConfig<keyof FileRoutesByPath>>(
    () => [
      {
        // isHidden: !sessionService.session?.user?.roles.includes('admin'),
        items: [
          {
            href: '/admin/users',
            // isHidden: !sessionService.hasPermission('user', 'read'),
            name: 'Users',
          },
        ],
        name: 'Admin',
      },
      {
        // isHidden: sessionService.session?.user.roles.length === 0,
        items: [
          {
            href: '/home/calendars',
            name: 'Calendars',
          },
          {
            href: '/home/events',
            name: 'Events',
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
    ],
    [],
  );
};
