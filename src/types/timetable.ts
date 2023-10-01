export type Duration = { hours: number; minutes: number };

export type LabelValue<T> = {
  label: string;
  value: T;
};

export type ClassType = {
  details: string;
  group: LabelValue<{ index: number; type: GROUP_TYPE }>;
};

export type ClassesBlockType = {
  classes: (ClassType | null)[];
  duration: LabelValue<Duration>;
  startsAt: LabelValue<Date>;
};

export const GROUP_TYPE_CONST = {
  EXERCISE: 'GĆ',
  LABORATORY: 'GL',
  LANGUAGE: 'GANG',
  LECTURE: 'GW',
  UNKNOWN: 'UNKNOWN',
} as const;

export type GROUP_TYPE =
  (typeof GROUP_TYPE_CONST)[keyof typeof GROUP_TYPE_CONST];

export type UniDayType = {
  classesBlock: ClassesBlockType[];
  date: Date;
};

export type TimetableEndpoint = {
  pubDate: Date;
  timetable: UniDayType[];
};
