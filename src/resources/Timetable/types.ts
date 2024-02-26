import type { Lesson } from '@types';

export type TimetableParserArgs = undefined;

export type TimetableParserReturn = {
  lessons: Lesson[];
};

type TimetableQueriedGroups = {
  exerciseGroup: number;
  laboratoryGroup: number;
};

export type TimetableQueryArgs = {
  year: number;
} & (TimetableQueriedGroups | Partial<TimetableQueriedGroups>);
