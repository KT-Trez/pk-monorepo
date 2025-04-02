import type { FieldOfStudy } from './fieldOfStudy.js';

export type GroupApi = {
  fieldOfStudyId: FieldOfStudy;
  groupUid: string;
  name: string;
  year: Date;
};

export type GroupDb = {
  // biome-ignore lint/style/useNamingConvention: this is a database field
  field_of_study_id: FieldOfStudy;
  // biome-ignore lint/style/useNamingConvention: this is a database field
  group_uid: string;
  // biome-ignore lint/style/useNamingConvention: this is a database field
  object_type_uid: string;
  name: string;
  year: string;
};
