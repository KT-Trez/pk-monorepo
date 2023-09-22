export type Duration = { hours: number; minutes: number };

export type Lesson = {
  details: string;
  duration: Duration;
  group: string;
  startsAt: Date;
};

export type ScheduleParser = {
  parseLessons(): Lesson[];
  parseYear(): string;
};
