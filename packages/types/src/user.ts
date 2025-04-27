import type { ConstValues } from './helpers.js';

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
