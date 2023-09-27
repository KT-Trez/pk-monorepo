export type Duration = { hours: number; minutes: number };

export type LabelValue<T> = {
  label: string;
  value: T;
};

export type ClassType = {
  details: string;
  group: string;
};

export type ClassesBlockType = {
  classes: ClassType[];
  duration: LabelValue<Duration>;
  startsAt: LabelValue<Date>;
};

export type UniDayType = {
  classesBlock: ClassesBlockType[];
  date: Date;
};

export type TimetableEndpoint = {
  pubDate: Date;
  timetable: UniDayType[];
};
