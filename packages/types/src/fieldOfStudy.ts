import type { ConstValues } from './helpers.ts';

export const FieldsOfStudy = {
  appliedMathematics: 1,
  computerScience: 2,
  computerSciencePartTime: 3,
  mathematics: 4,
} as const;
export type FieldOfStudy = ConstValues<typeof FieldsOfStudy>;

export type FieldOfStudyDb = {
  description: null | string;
  // biome-ignore lint/style/useNamingConvention: this is a database field
  field_of_study_id: FieldOfStudy;
  name: string;
};
