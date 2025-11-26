import type { CalendarApi } from '@pk/types/calendar.js';
import type { UserApi, UserRoles } from '@pk/types/user.js';

export type PermissionCheck<R extends keyof PermissionsByResource, A extends keyof PermissionsByResource[R]> =
  | ((user: UserApi, data?: PermissionsByResource[R][A]) => boolean)
  | boolean;

export type PermissionsByResource = {
  calendar: {
    create: CalendarApi;
    read: CalendarApi;
  };
  user: {
    create: UserApi;
    read: UserApi;
  };
};

export type PermissionsByRole = {
  [R in UserRoles]: {
    [K in keyof PermissionsByResource]?: {
      [A in keyof PermissionsByResource[K]]?: PermissionCheck<K, A>;
    };
  };
};
