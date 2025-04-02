import type { ConstValues } from './helpers.ts';

export const FieldsOfStudy = {
  appliedMathematics: 1,
  computerScience: 2,
  computerSciencePartTime: 3,
  mathematics: 4,
} as const;
export type FieldOfStudy = ConstValues<typeof FieldsOfStudy>;
