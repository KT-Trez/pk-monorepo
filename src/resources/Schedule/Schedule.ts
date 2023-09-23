import { timetableIcsPath, timetableXlsPath } from 'config';
import { ParserInterface, WriterInterface } from 'types/interfaces';
import { Lesson } from './types';

export class Schedule {
  lessons: Lesson[];
  year: string;

  constructor() {
    this.lessons = [];
    this.year = '[UNKNOWN]';
  }

  parse(parser: ParserInterface<{ lessons: Lesson[]; year: string }>) {
    // todo: change to dynnamic path
    const { lessons, year } = parser.parse(timetableXlsPath);
    this.lessons = lessons;
    this.year = year;
    return this;
  }

  writeToFile<T>(
    dataAdapter: (lessons: Lesson[]) => T[],
    writer: WriterInterface<T[]>,
  ) {
    // todo: change to dynnamic path
    writer.write(dataAdapter(this.lessons), timetableIcsPath);
    return this;
  }
}
