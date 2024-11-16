import type { Collection } from './api.ts';
import type { ConstAssertion, Duration, LabeledInfo } from './helpers.ts';

export type Day = {
  date: Date;
  items: Lessons[];
};

export const GroupType = {
  EXERCISE: 'GĆ',
  LABORATORY: 'GL',
  LANGUAGE: 'GANG',
  LECTURE: 'GW',
  UNKNOWN: 'UNKNOWN',
} as const;
export type GroupTypes = ConstAssertion<typeof GroupType>;

export type Lesson = {
  description: string;
  group: LabeledInfo<{ index: number; type: GroupTypes; year: number }>;
};

export type Lessons = {
  duration: LabeledInfo<Duration>;
  items: Lesson[];
  startsAt: LabeledInfo<Date>;
};

export type Timetable = Collection<Day, { modifiedDate: Date }>;
