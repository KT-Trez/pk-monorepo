import { XlsParser } from '../../../components';
import { GroupType, GroupTypes, LabeledInfo, ParserInterface } from '../../../types';
import { UniDay } from '../UniDay';
import { ClassesBlock } from './ClassesBlock';
import { XlsFormat, XlsParserConfig } from './types';

// todo: improve
export class XlsTimetableParser implements ParserInterface<{ uniDays: UniDay[]; year: string }> {
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

  #parseClasses(row: XlsFormat): ({
    details: string;
    group: LabeledInfo<{ index: number; type: GroupTypes }>;
  } | null)[] {
    return this.#config.classes.map(classT => {
      const classCell = row[classT];
      if (typeof classCell === 'string') {
        const groupIndex = this.#config.classes.indexOf(classT);
        const groupType = this.#pickGroup(classCell);

        return {
          details: classCell,
          group: {
            label: `${groupType}${groupIndex}`,
            value: {
              index: groupIndex,
              type: groupType,
            },
          },
        };
      }
      return null;
    });
  }

  #parseClassesBlock(row: XlsFormat, date: Date) {
    const startsAtCell = row[this.#config.hourIndex];
    if (typeof startsAtCell === 'string' && this.#config.hourRegex.test(startsAtCell)) {
      const { hours, minutes } = this.#parseTime(startsAtCell.split('-').at(0) ?? '00:00');
      const startsAt = new Date(date);
      startsAt.setHours(hours, minutes);

      const classesBlock = new ClassesBlock('', { hours: 2, minutes: 30 }, startsAtCell, startsAt);

      classesBlock.addClasses(this.#parseClasses(row));

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

      const classesBlock = this.#parseClassesBlock(row, uniDay?.date ?? date);
      if (classesBlock) {
        uniDay!.addLessonBlock(classesBlock);
      }

      this.#parseYear(row);
    }

    this.#uniDays = uniDays;
  }

  #parseTime(text: string): { hours: number; minutes: number } {
    const timeParts = text.split(':');
    return {
      hours: parseInt(timeParts.at(0) ?? '0'),
      minutes: parseInt(timeParts.at(1) ?? '0'),
    };
  }

  #parseXls(filePath: string) {
    return new XlsParser<XlsFormat>()
      .parse(filePath)
      .map(sheet => sheet.data)
      .flat();
  }

  #parseYear(row: XlsFormat) {
    const yearCell = row[this.#config.yearIndex];
    if (typeof yearCell === 'string' && this.#config.yearRegex.test(yearCell)) {
      this.#year = yearCell;
    }
  }

  #pickGroup(details: string): GroupTypes {
    if (/ang(ielski)?/i.test(details)) {
      return GroupType.LANGUAGE;
    } else if (/[cć]wiczenia/i.test(details)) {
      return GroupType.EXERCISE;
    } else if (/lab/i.test(details)) {
      return GroupType.LABORATORY;
    } else if (/wyk[lł]ad/i.test(details) || /dzia[lł]ownia/i.test(details)) {
      return GroupType.LECTURE;
    } else {
      return GroupType.UNKNOWN;
    }
  }
}
