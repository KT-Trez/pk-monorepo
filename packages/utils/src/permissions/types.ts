import type {
  EnrichedCalendarApi,
  EnrichedCalendarCreateApiPayload,
  EnrichedCalendarUpdateApiPayload,
} from '@pk/types/calendar.js';
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
    create: EnrichedCalendarCreateApiPayload;
    delete: EnrichedCalendarApi;
    follow: EnrichedCalendarApi;
    read: EnrichedCalendarApi;
    share: EnrichedCalendarApi;
    unfollow: EnrichedCalendarApi;
    update: { calendar?: EnrichedCalendarApi; payload?: EnrichedCalendarUpdateApiPayload };
  };
  event: {
    create: EventDb;
    delete: EventDb;
    read: EventDb;
    update: EventDb;
  };
  user: {
    create: EnrichedUserApiCreatePayload;
    delete: FullUserApi;
    read: FullUserApi;
    update: EnrichedUserApiUpdatePayload;
  };
};

export type PermissionsByRole = {
  [R in UserRoles]: {
    [K in keyof PermissionsByResource]?: {
      [A in keyof PermissionsByResource[K]]?: PermissionCheck<K, A>;
    };
  };
};
