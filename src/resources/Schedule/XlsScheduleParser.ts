import { Sheet } from '../../types/sheet';
import { XlsParser } from '../XlsParser';
import { Class, ClassBuilder } from './Class';
import { IScheduleParser } from './types';

export type ScheduleParserConfig = {
  classes: {
    dataIndex: number[];
    groupName: string[];
    hourIndex: number;
    test: RegExp;
  };
  day: {
    dataIndex: number;
  };
  year: {
    dataIndex: number;
    test: RegExp;
  };
};

export class XlsScheduleParser implements IScheduleParser {
  private readonly config: ScheduleParserConfig;
  private readonly sheet: Sheet<number | string>;

  constructor(config: ScheduleParserConfig, scheduleFile: string) {
    this.config = config;
    this.sheet = new XlsParser(scheduleFile).parse(true);
  }

  #isClassRow(row: (number | string)[]) {
    const data = row.at(this.config.classes.hourIndex);
    if (!data) {
      return false;
    }

    return this.config.classes.test.test(data.toString());
  }

  #isDayRow(row: (number | string)[]) {
    const data = row.at(this.config.day.dataIndex);
    if (!data) {
      return false;
    }

    return typeof data === 'object';
  }

  parseClasses(): Class[] {
    const classes: Class[] = [];

    let date: Date;
    for (const row of this.sheet.data) {
      if (this.#isDayRow(row)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        date = row.at(this.config.day.dataIndex) as Date;
      }

      if (this.#isClassRow(row)) {
        this.config.classes.dataIndex.forEach((datumIndex, i) => {
          if (row[datumIndex]) {
            classes.push(
              new ClassBuilder()
                .setDate(date)
                .setGroup(this.config.classes.groupName.at(i) as string)
                .setHour(row[this.config.classes.hourIndex] as string)
                .setContent(row[datumIndex] as string)
                .build(),
            );
          }
        });
      }
    }

    return classes;
  }

  parseYear(): string {
    for (const row of this.sheet.data) {
      const data = row.at(this.config.year.dataIndex);
      if (!data) {
        return '';
      }

      if (this.config.year.test.test(data.toString())) {
        return data.toString();
      }
    }

    throw Error('Year not found');
  }
}
