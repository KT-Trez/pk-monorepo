import type { CalendarDb } from '@pk/types/calendar.js';
import type { EventDb } from '@pk/types/event.js';
import type {
  EnrichedUserApiCreatePayload,
  EnrichedUserApiUpdatePayload,
  FullUserApi,
  UserRoles,
} from '@pk/types/user.js';

export type PermissionCheck<R extends keyof PermissionsByResource, A extends keyof PermissionsByResource[R]> =
    | ((user: FullUserApi, data?: PermissionsByResource[R][A]) => boolean)
    | boolean;

export type PermissionsByResource = {
  calendar: {
    create: CalendarDb;
    read: CalendarDb;
    update: CalendarDb;
    delete: CalendarDb;
  };
  event: {
    create: EventDb;
    read: EventDb;
    update: EventDb;
    delete: EventDb;
  };
  user: {
    create: EnrichedUserApiCreatePayload;
    read: FullUserApi;
    update: EnrichedUserApiUpdatePayload;
    delete: FullUserApi;
  };
};

export type PermissionsByRole = {
  [R in UserRoles]: {
    [K in keyof PermissionsByResource]?: {
      [A in keyof PermissionsByResource[K]]?: PermissionCheck<K, A>;
    };
  };
};
