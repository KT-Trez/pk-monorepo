import type { NavCategory } from '../../../components/Nav/types.ts';
import { sessionService } from '../../../main.ts';

export const useNavConfig = (): NavCategory[] => {
  return [
    {
      isHidden: !sessionService.session?.user?.roles.includes('admin'),
      items: [
        {
          href: '#/admin/users',
          isHidden: !sessionService.hasPermission('user', 'read'),
          name: 'Users',
        },
      ],
      name: 'Admin',
    },
    {
      isHidden: sessionService.session?.user.roles.length === 0,
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
  ];
};
