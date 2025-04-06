import type { ConstValues } from './helpers.js';

export const AuditType = {
  eventCreated: 0,
  eventUpdated: 1,
  eventDeleted: 2,
  groupCreated: 3,
  groupUpdated: 4,
  groupDeleted: 5,
  groupPermissionsAdded: 6,
  groupPermissionsRemoved: 7,
  studentCreated: 8,
  studentUpdated: 9,
  studentDeleted: 10,
  studentPermissionsAdded: 11,
  studentPermissionsRemoved: 12,
  login: 13,
  logout: 14,
} as const;
export type AuditTypes = ConstValues<typeof AuditType>;

export type AuditTypeDb = {
  description: null | string;
  // biome-ignore lint/style/useNamingConvention: this is a database field
  audit_type_id: AuditTypes;
  name: string;
};
