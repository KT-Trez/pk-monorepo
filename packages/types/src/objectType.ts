import type { ConstValues } from './helpers.js';

export const ObjectType = {
  audit: 1,
  event: 2,
  group: 3,
  groupPermissionsToObject: 4,
  student: 5,
  studentPermissionsToObject: 6,
};
export type ObjectTypes = ConstValues<typeof ObjectType>;
