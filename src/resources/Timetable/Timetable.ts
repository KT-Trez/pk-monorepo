import { timetableXlsPath } from '../../config';
import { Lesson, ParserInterface, WriterInterface } from '../../types';

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
    path: string,
    writer: WriterInterface<T[]>,
  ) {
    writer.write(dataAdapter(this.lessons), path);
    return this;
  }
}
