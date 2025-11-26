import type { CalendarApi } from './calendar.js';
import type { ConstValues } from './helpers.js';
import type { BaseModelApi } from './model.js';
import type { UserRoleApi } from './userRole.js';

export type UserApi = BaseModelApi & {
  calendars?: CalendarApi[];
  email: string;
  // events: EventApi[];
  name: string;
  // todo: make optional
  roles: UserRoleApi[];
  surname: string;
};

export type FullUserApi = {
  createdAt: string;
  email: string;
  modifiedAt: string;
  name: string;
  roles: UserRoles[];
  surname: string;
  uid: string;
};

export type EnrichedUserApi = FullUserApi & {
  password: Buffer;
};

export type EnrichedUserApiCreatePayload = Pick<FullUserApi, 'email' | 'name' | 'roles' | 'surname'> & {
  password: string;
};

export type EnrichedUserApiUpdatePayload = Partial<EnrichedUserApiCreatePayload> & {
  password?: string;
  uid: FullUserApi['uid'];
};

export const UserRoleEnum = {
  Admin: 'admin',
  Member: 'member',
} as const;
export type UserRoles = ConstValues<typeof UserRoleEnum>;
