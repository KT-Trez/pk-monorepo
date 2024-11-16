import type { LabeledInfo } from 'types/helpers';
import type { GroupTypes, Lesson as ILesson } from 'types/timetable';

export class Lesson implements ILesson {
  description: string;
  group: LabeledInfo<{ index: number; type: GroupTypes; year: number }>;

  constructor(description: string, groupIndex: number, groupType: GroupTypes, groupYear: number) {
    this.description = description.replace(/\s+/g, ' ').trim();
    this.group = {
      label: `${groupType}${groupIndex}`,
      value: {
        index: groupIndex,
        type: groupType,
        year: groupYear,
      },
    };
  }
}
