import {
  Duration,
  LabelValue,
  LessonBlockType,
  LessonType,
} from '../../../types';

export class LessonBlock implements LessonBlockType {
  duration: LabelValue<Duration>;
  lessons: LessonType[];
  startsAt: LabelValue<Date>;

  constructor(
    durationLabel: string,
    durationValue: Duration,
    startsAtLabel: string,
    startsAtValue: Date,
  ) {
    this.duration = {
      label: durationLabel,
      value: durationValue,
    };
    this.lessons = [];
    this.startsAt = {
      label: startsAtLabel,
      value: startsAtValue,
    };
  }

  addLesson(details: string, group: string) {
    this.lessons.push({ details, group });
    return this;
  }
}
