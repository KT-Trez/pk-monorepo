import type { EnrichedCalendarApi, EnrichedCalendarCreateApiPayload } from '@pk/types/calendar.js';
import type { EventApi, EventApiCreatePayload } from '@pk/types/event.js';
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
    update: EnrichedCalendarApi;
  };
  event: {
    create: { calendar?: EnrichedCalendarApi; event?: EventApiCreatePayload };
    delete: { calendar?: EnrichedCalendarApi; event?: EventApi };
    read: { calendar?: EnrichedCalendarApi; event?: EventApi };
    update: { calendar?: EnrichedCalendarApi; event?: EventApi };
  };
  options: {
    calendar: EnrichedCalendarApi;
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
