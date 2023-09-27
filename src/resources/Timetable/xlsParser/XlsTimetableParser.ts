import { XlsParser } from '../../../components';
import { ParserInterface } from '../../../types';
import { UniDay } from '../UniDay';
import { ClassesBlock } from './ClassesBlock';
import { XlsFormat, XlsParserConfig } from './types';

// todo: improve
export class XlsTimetableParser
  implements ParserInterface<{ uniDays: UniDay[]; year: string }>
{
  #config: XlsParserConfig;
  #uniDays: UniDay[];
  #year: string;

  constructor(config: XlsParserConfig) {
    this.#config = config;
    this.#uniDays = [];
    this.#year = '';
  }

  parse(filePath: string): { uniDays: UniDay[]; year: string } {
    const rows = this.#parseXls(filePath);
    this.#parseRows(rows);
    return { uniDays: this.#uniDays, year: this.#year };
  }

  #parseClassesBlock(row: XlsFormat) {
    const startsAtCell = row[this.#config.hourIndex];
    if (
      typeof startsAtCell === 'string' &&
      this.#config.hourRegex.test(startsAtCell)
    ) {
      const classesBlock = new ClassesBlock(
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
          classesBlock.addLesson(lessonCell, group);
        }
      });

      return classesBlock;
    }
    return undefined;
  }

  #parseDate(previousDate: Date, row: XlsFormat) {
    const dateCell = row[this.#config.dateIndex];
    if (dateCell instanceof Date) {
      return dateCell;
    }
    return previousDate;
  }

  #parseRows(rows: XlsFormat[]) {
    const uniDays: UniDay[] = [];

    const date: Date = new Date();
    let uniDay: UniDay | undefined;

    for (const row of rows) {
      const parsedDate = this.#parseDate(date, row);
      if (parsedDate !== date && uniDay) {
        uniDays.push(uniDay);
      }
      if (parsedDate !== date) {
        uniDay = new UniDay(parsedDate);
      }

      const lessonBlock = this.#parseClassesBlock(row);
      if (lessonBlock) {
        uniDay!.addLessonBlock(lessonBlock);
      }

      this.#parseYear(row);
    }

    this.#uniDays = uniDays;
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
    } else if (/[cć]wiczenia/i.test(details)) {
      return this.#config.groups.get('exercises')![labelIndex]!;
    } else if (/lab/i.test(details)) {
      return this.#config.groups.get('laboratories')![labelIndex]!;
    } else {
      return 'UNKNOWN';
    }
  }
}
