import { Lesson, ScheduleParser } from './types';

export class Schedule {
  classes: Lesson[];
  year: string;

  constructor() {
    this.classes = [];
    this.year = 'year not specified';
  }

  parse(parser: ScheduleParser) {
    this.classes = parser.parseLessons();
    this.year = parser.parseYear();
    return this;
  }
}
