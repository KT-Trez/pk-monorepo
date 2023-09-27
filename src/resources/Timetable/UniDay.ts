import { ClassesBlockType, UniDayType } from '../../types';

export class UniDay implements UniDayType {
  classesBlock: ClassesBlockType[];
  date: Date;

  constructor(date: Date) {
    this.date = date;
    this.classesBlock = [];
  }

  addLessonBlock(lessonBlock: ClassesBlockType) {
    this.classesBlock.push(lessonBlock);
  }
}
