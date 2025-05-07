import type { ConstValues } from '@pk/types/helpers.js';

export type ClassInfo = {
  details: string;
  endsAt: Date;
  group: Group;
  location: string;
  startsAt: Date;
};

export type ClassDescription = {
  details: string;
  groupType: GroupTypes;
  location: string;
};

export type Group = {
  index: number;
  type: GroupTypes;
  year: number;
};

export const GroupType = {
  Exercise: 'GĆ',
  Laboratory: 'GL',
  Language: 'GLANG',
  Lecture: 'GW',
  Unknown: 'GU',
} as const;
export type GroupTypes = ConstValues<typeof GroupType>;
