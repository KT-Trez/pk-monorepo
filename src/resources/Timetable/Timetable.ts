import { timetableIcsPath, timetableXlsPath } from 'config';
import { ParserInterface, WriterInterface } from 'types';
import { Lesson } from './types';

export class Timetable {
  lessons: Lesson[];
  year: string;

  constructor() {
    this.lessons = [];
    this.year = '[UNKNOWN]';
  }

  parse(parser: ParserInterface<{ lessons: Lesson[]; year: string }>) {
    // todo: change to dynamic path
    const { lessons, year } = parser.parse(timetableXlsPath);
    this.lessons = lessons;
    this.year = year;
    return this;
  }

  writeToFile<T>(
    dataAdapter: (lessons: Lesson[]) => T[],
    writer: WriterInterface<T[]>,
  ) {
    // todo: change to dynamic path
    writer.write(dataAdapter(this.lessons), timetableIcsPath);
    return this;
  }
}
