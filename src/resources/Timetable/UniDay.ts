import { Day, Lessons } from '../../types';

export class UniDay implements Day {
  lessons: Lessons[];
  date: Date;

  constructor(date: Date) {
    this.date = date;
    this.lessons = [];
  }

  addLessonBlock(lessonBlock: Lessons) {
    this.lessons.push(lessonBlock);
  }
}
