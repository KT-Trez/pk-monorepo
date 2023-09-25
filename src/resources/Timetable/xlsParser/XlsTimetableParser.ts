import { ParserInterface } from 'types';
import { XlsParser } from '../../../components';
import { SchoolDay } from '../SchoolDay';
import { LessonBlock } from './LessonBlock';
import { XlsFormat, XlsParserConfig } from './types';

export type xlsTimetable<T extends number[]> = {
  dateIndex: number;
  hourIndex: number;
  hourRegex: RegExp;
  lessons: T;
  yearIndex: number;
  yearRegex: RegExp;
};

// todo: improve
export class XlsTimetableParser
  implements ParserInterface<{ schoolDays: SchoolDay[]; year: string }>
{
  #config: XlsParserConfig;
  #schoolDays: SchoolDay[];
  #year: string;

  constructor(config: XlsParserConfig) {
    this.#config = config;
    this.#schoolDays = [];
    this.#year = '';
  }

  parse(filePath: string): { schoolDays: SchoolDay[]; year: string } {
    const rows = this.#parseXls(filePath);
    this.#parseRows(rows);
    return { schoolDays: this.#schoolDays, year: this.#year };
  }

  #parseDate(previousDate: Date, row: XlsFormat) {
    const dateCell = row[this.#config.dateIndex];
    if (dateCell instanceof Date) {
      return dateCell;
    }
    return previousDate;
  }

  #parseLessonBlock(row: XlsFormat) {
    const startsAtCell = row[this.#config.hourIndex];
    if (
      typeof startsAtCell === 'string' &&
      this.#config.hourRegex.test(startsAtCell)
    ) {
      const lessonBlock = new LessonBlock(
        '',
        { hours: 0, minutes: 0 },
        startsAtCell,
        new Date(),
      );

      this.#config.lessons.forEach((lesson) => {
        const lessonCell = row[lesson];
        if (typeof lessonCell === 'string') {
          const indexOfLessonCell = this.#config.lessons.indexOf(lesson);
          const group = this.#pickGroup(lessonCell, indexOfLessonCell);
          lessonBlock.addLesson(lessonCell, group);
        }
      });

      return lessonBlock;
    }
    return undefined;
  }

  #parseRows(rows: XlsFormat[]) {
    const schoolDays: SchoolDay[] = [];

    const date: Date = new Date();
    let schoolDay: SchoolDay = new SchoolDay(date);

    for (const row of rows) {
      const parsedDate = this.#parseDate(date, row);
      if (parsedDate !== date) {
        schoolDays.push(schoolDay);
        schoolDay = new SchoolDay(parsedDate);
      }

      const lessonBlock = this.#parseLessonBlock(row);
      if (lessonBlock) {
        schoolDay.addLessonBlock(lessonBlock);
      }

      this.#parseYear(row);
    }

    this.#schoolDays = schoolDays;
  }

  #parseXls(filePath: string) {
    return new XlsParser<XlsFormat>()
      .parse(filePath)
      .map((sheet) => sheet.data)
      .flat();
  }

  #parseYear(row: XlsFormat) {
    const yearCell = row[this.#config.yearIndex];
    if (typeof yearCell === 'string' && this.#config.yearRegex.test(yearCell)) {
      this.#year = yearCell;
    }
  }

  // todo: add  english groups
  #pickGroup(details: string, labelIndex: number) {
    if (/wyk[lł]ad/i.test(details)) {
      return this.#config.groups.get('lecture')![labelIndex]!;
    } else if (/[cć]siczenia/i.test(details)) {
      return this.#config.groups.get('exercises')![labelIndex]!;
    } else if (/lab/i.test(details)) {
      return this.#config.groups.get('laboratories')![labelIndex]!;
    } else {
      return 'UNKNOWN';
    }
  }
}
