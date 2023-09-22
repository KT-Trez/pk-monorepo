import { icsSchedulePatch, scheduleFilePath } from '../../config';
import { ParserInterface, WriterInterface } from '../../types/interfaces';
import { Lesson } from './types';

export class Schedule {
  lessons: Lesson[];
  year: string;

  constructor() {
    this.lessons = [];
    this.year = '[UNKNOWN]';
  }

  parse(parser: ParserInterface<{ lessons: Lesson[]; year: string }>) {
    const { lessons, year } = parser.parse(scheduleFilePath);
    this.lessons = lessons;
    this.year = year;
    return this;
  }

  writeToFile<T>(
    dataAdapter: (lessons: Lesson[]) => T[],
    writer: WriterInterface<T>,
  ) {
    writer.write(dataAdapter(this.lessons), icsSchedulePatch);
    return this;
  }
}
