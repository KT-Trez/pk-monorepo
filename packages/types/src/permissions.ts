import type { ConstValues } from './helpers.js';
import type { ObjectTypes } from './objectType.js';

export type GroupPermissionsToObjectDb = {
  // biome-ignore lint/style/useNamingConvention: this is a format of the data from the API
  calculated_permissions: number;
  // biome-ignore lint/style/useNamingConvention: this is a format of the data from the API
  group_uid: string;
  // biome-ignore lint/style/useNamingConvention: this is a format of the data from the API
  object_type_id: ObjectTypes;
  // biome-ignore lint/style/useNamingConvention: this is a format of the data from the API;
  object_uid: string;
};

export const Permission = {
  admin: 0,
} as const;
export type Permissions = ConstValues<typeof Permission>;

export type PermissionDb = {
  description: null | string;
  name: string;
  // biome-ignore lint/style/useNamingConvention: this is a format of the data from the API
  permission_id: Permissions;
};

export type StudentPermissionsToObjectDb = {
  // biome-ignore lint/style/useNamingConvention: this is a format of the data from the API
  calculated_permissions: number;
  // biome-ignore lint/style/useNamingConvention: this is a format of the data from the API
  object_type_id: ObjectTypes;
  // biome-ignore lint/style/useNamingConvention: this is a format of the data from the API
  object_uid: string;
  // biome-ignore lint/style/useNamingConvention: this is a format of the data from the API
  student_uid: string;
};
