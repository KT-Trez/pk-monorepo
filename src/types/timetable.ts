import type { Collection } from './api';
import type { ConstAssertion, Duration, LabeledInfo } from './helpers';

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
  details: string;
  group: LabeledInfo<{ index: number; type: GroupTypes }>;
};

export type Lessons = {
  duration: LabeledInfo<Duration>;
  items: Lesson[];
  startsAt: LabeledInfo<Date>;
};

export type Timetable = Collection<Day, { modifiedDate: Date }>;
