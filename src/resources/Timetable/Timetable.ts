import { timetableXlsPath } from '../../config';
import { ParserInterface, WriterInterface } from '../../types';
import { UniDay } from './UniDay';

export class Timetable {
  uniDays: UniDay[];
  year: string;

  constructor() {
    this.uniDays = [];
    this.year = '[UNKNOWN]';
  }

  parse(parser: ParserInterface<{ uniDays: UniDay[]; year: string }>) {
    // todo: change to dynamic path
    const { uniDays, year } = parser.parse(timetableXlsPath);
    this.uniDays = uniDays;
    this.year = year;
    return this;
  }

  writeToFile<T>(
    dataAdapter: (uniDays: UniDay[]) => T,
    path: string,
    writer: WriterInterface<T>,
  ) {
    writer.write(dataAdapter(this.uniDays), path);
    return this;
  }
}
