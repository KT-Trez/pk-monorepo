import type { SideNavConfig } from '@/components/SideNav/types.ts';
import { useMemo } from 'react';

export const useSideNavConfig = () => {
  return useMemo<SideNavConfig>(
    () => [
      {
        // isHidden: !sessionService.session?.user?.roles.includes('admin'),
        items: [
          {
            href: '#/admin/admin',
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
            href: '#/home/calendars',
            name: 'Calendars',
          },
          {
            href: '#/home/events',
            name: 'Events',
          },
        ],
        name: 'Home',
      },
      {
        items: [
          {
            href: '#/settings/account',
            name: 'Account',
          },
        ],
        name: 'Settings',
      },
    ],
    [],
  );
};
