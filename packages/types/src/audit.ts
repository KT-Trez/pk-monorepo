import type { AuditTypes } from './auditType.js';
import type { ObjectType } from './objectType.js';

export type AuditDb = {
  // biome-ignore lint/style/useNamingConvention: this is a format of the data from the API
  audit_type_id: AuditTypes;
  // biome-ignore lint/style/useNamingConvention: this is a format of the data from the API
  object_type_id: typeof ObjectType.audit;
  // biome-ignore lint/style/useNamingConvention: this is a format of the data from the API
  object_uid: string;
  timestamp: string;
};
