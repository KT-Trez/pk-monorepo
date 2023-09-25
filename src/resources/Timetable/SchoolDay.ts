import { LessonBlockType, SchoolDayType } from '../../types';

export class SchoolDay implements SchoolDayType {
  date: Date;
  lessonBlock: LessonBlockType[];

  constructor(date: Date) {
    this.date = date;
    this.lessonBlock = [];
  }

  addLessonBlock(lessonBlock: LessonBlockType) {
    this.lessonBlock.push(lessonBlock);
  }
}
