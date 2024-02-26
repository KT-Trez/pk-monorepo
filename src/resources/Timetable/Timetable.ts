import type { Lesson, ParserInterfaceV2 } from '@types';
import type { TimeTableParserArgs, TimeTableParserReturn } from './types';

export class Timetable {
  lessons: Lesson[] = [];

  parse(parser: ParserInterfaceV2<TimeTableParserArgs, TimeTableParserReturn>) {
    const { lessons } = parser.parse(undefined);
    this.lessons = lessons;

    return this;
  }

  // writeToFile<T>(
  //   dataAdapter: (schoolDays: SchoolDay[]) => T[],
  //   path: string,
  //   writer: WriterInterface<T[]>,
  // ) {
  //   writer.write(dataAdapter(this.schoolDays), path);
  //   return this;
  // }
}
