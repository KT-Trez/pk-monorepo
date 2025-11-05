import type { ConstValues } from './helpers.js';
import type { BaseModelApi } from './model.js';

export type UserApi = BaseModelApi & {
  // calendars: CalendarApi[];
  email: string;
  // events: EventApi[];
  name: string;
  // roles: UserRoles[];
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

export const UserRole = {
  Admin: 'admin',
  Member: 'member',
} as const;
export type UserRoles = ConstValues<typeof UserRole>;
