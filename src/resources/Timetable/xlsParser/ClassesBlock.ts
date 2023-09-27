import {
  ClassesBlockType,
  ClassType,
  Duration,
  LabelValue,
} from '../../../types';

export class ClassesBlock implements ClassesBlockType {
  classes: ClassType[];
  duration: LabelValue<Duration>;
  startsAt: LabelValue<Date>;

  constructor(
    durationLabel: string,
    durationValue: Duration,
    startsAtLabel: string,
    startsAtValue: Date,
  ) {
    this.classes = [];
    this.duration = {
      label: durationLabel,
      value: durationValue,
    };
    this.startsAt = {
      label: startsAtLabel,
      value: startsAtValue,
    };
  }

  addLesson(details: string, group: string) {
    this.classes.push({ details, group });
    return this;
  }
}
