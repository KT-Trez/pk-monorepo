export type Group = {
  number: number;
  // columnIndex: number;
  year: number;
  type: GroupTypeValues;
};

export const GroupType = {
  ENGLISH: 'gang',
  EXERCISE: 'gc',
  LECTURE: 'gw',
  LABORATORY: 'gl',
  UNKNOWN: 'g-unknown',
} as const;

export type GroupTypeValues = (typeof GroupType)[keyof typeof GroupType];

export type Lesson = {
  details: string;
  end: Date;
  group: Group;
  start: Date;
};
