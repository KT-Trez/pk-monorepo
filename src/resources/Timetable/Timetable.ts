import { timetableIcsPath, timetableXlsPath } from 'config';
import { ParserInterface, WriterInterface } from 'types';
import { SchoolDay } from './SchoolDay';

export class Timetable {
  schoolDays: SchoolDay[];
  year: string;

  constructor() {
    this.schoolDays = [];
    this.year = '[UNKNOWN]';
  }

  parse(parser: ParserInterface<{ schoolDays: SchoolDay[]; year: string }>) {
    // todo: change to dynamic path
    const { schoolDays, year } = parser.parse(timetableXlsPath);
    this.schoolDays = schoolDays;
    this.year = year;
    return this;
  }

  writeToFile<T>(
    dataAdapter: (schoolDays: SchoolDay[]) => T[],
    writer: WriterInterface<T[]>,
  ) {
    // todo: change to dynamic path
    writer.write(dataAdapter(this.schoolDays), timetableIcsPath);
    return this;
  }
}
