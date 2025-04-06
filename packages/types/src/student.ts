import type { ObjectType } from './objectType.js';

export type StudentDb = {
  album: number;
  email: string;
  name: string;
  // biome-ignore lint/style/useNamingConvention: this is a format of the data from the API
  object_type_id: typeof ObjectType.student;
  password: string;
  // biome-ignore lint/style/useNamingConvention: this is a format of the data from the API
  student_uid: string;
  surname: string;
};

export type StudentInGroupDb = {
  // biome-ignore lint/style/useNamingConvention: this is a format of the data from the API
  group_uid: string;
  // biome-ignore lint/style/useNamingConvention: this is a format of the data from the API
  student_uid: string;
};
