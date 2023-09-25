export type Duration = { hours: number; minutes: number };

export type LabelValue<T> = {
  label: string;
  value: T;
};

export type LessonType = {
  details: string;
  group: string;
};

export type LessonBlockType = {
  duration: LabelValue<Duration>;
  lessons: LessonType[];
  startsAt: LabelValue<Date>;
};

export type SchoolDayType = {
  date: Date;
  lessonBlock: LessonBlockType[];
};
