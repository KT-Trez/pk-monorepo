export type Group = {
  number: number;
  year: number;
  type: GroupTypeValues;
};

export const GroupType = {
  ENGLISH: 'GANG',
  EXERCISE: 'GC',
  LABORATORY: 'GL',
  LECTURE: 'GW',
  UNKNOWN: 'GU',
} as const;

export type GroupTypeValues = (typeof GroupType)[keyof typeof GroupType];

export type Lesson = {
  details: string;
  end: Date;
  group: Group;
  start: Date;
};
