import { Class } from './Class';
import { IScheduleParser } from './types';

export class Schedule {
  classes: Class[];
  year: string;

  constructor() {
    this.classes = [];
    this.year = 'year not specified';
  }

  parse(parser: IScheduleParser) {
    this.classes = parser.parseClasses();
    this.year = parser.parseYear();
    return this;
  }
}
