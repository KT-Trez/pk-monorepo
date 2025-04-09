import type { Day as IDay, Lessons } from '@/types/timetable';

export class Day implements IDay {
  date: Date;
  items: Lessons[];

  constructor(date: Date) {
    this.date = date;
    this.items = [];
  }

  addLessons(item: Lessons): void {
    this.items.push(item);
  }
}
