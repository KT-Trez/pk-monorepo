import { Duration, GroupTypes, LabeledInfo, Lesson, Lessons } from '../../../types';

export class ClassesBlock implements Lessons {
  data: (Lesson | null)[];
  duration: LabeledInfo<Duration>;
  startsAt: LabeledInfo<Date>;

  constructor(durationLabel: string, durationValue: Duration, startsAtLabel: string, startsAtValue: Date) {
    this.data = [];
    this.duration = {
      label: durationLabel,
      value: durationValue,
    };
    this.startsAt = {
      label: startsAtLabel,
      value: startsAtValue,
    };
  }

  addClasses(
    classes: ({
      details: string;
      group: LabeledInfo<{ index: number; type: GroupTypes }>;
    } | null)[],
  ) {
    this.data = classes;
    return this;
  }
}
