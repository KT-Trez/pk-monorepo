import type { ConstValues } from './helpers.js';

export const ObjectType = {
  Audit: 0,
  Event: 1,
  Group: 2,
  GroupPermissionsToObject: 3,
  Users: 4,
  UserPermissionsToObject: 5,
} as const;
export type ObjectTypes = ConstValues<typeof ObjectType>;
