import {
  ClassesBlockType,
  ClassType,
  Duration,
  GROUP_TYPE,
  LabelValue,
} from '../../../types';

export class ClassesBlock implements ClassesBlockType {
  classes: (ClassType | null)[];
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

  addClasses(
    classes: ({
      details: string;
      group: LabelValue<{ index: number; type: GROUP_TYPE }>;
    } | null)[],
  ) {
    this.classes = classes;
    return this;
  }
}
