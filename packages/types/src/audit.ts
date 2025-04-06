import type { AuditTypes } from './auditType.js';
import type { ObjectType } from './objectType.js';

export type AuditDb = {
  // biome-ignore lint/style/useNamingConvention: this is a database field
  audit_type_id: AuditTypes;
  // biome-ignore lint/style/useNamingConvention: this is a database field
  object_type_id: typeof ObjectType.audit;
  // biome-ignore lint/style/useNamingConvention: this is a database field
  object_uid: string;
  timestamp: string;
};
