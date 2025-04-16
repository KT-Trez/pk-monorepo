import type { FieldOfStudy } from './fieldOfStudy.js';
import type { ObjectType } from './objectType.js';

export type GroupApi = {
  fieldOfStudyId: FieldOfStudy;
  name: string;
  type: typeof ObjectType.Group;
  uid: string;
  yearOfCreation: string;
};

export type GroupDb = {
  // biome-ignore lint/style/useNamingConvention: this is a database field
  field_of_study_id: FieldOfStudy;
  // biome-ignore lint/style/useNamingConvention: this is a database field
  group_uid: string;
  name: string;
  // biome-ignore lint/style/useNamingConvention: this is a database field
  object_type_id: typeof ObjectType.Group;
  year: string;
};
