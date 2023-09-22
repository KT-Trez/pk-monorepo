import { XlsParser } from '../../components/XlsParser';
import { ParserInterface } from '../../types/interfaces';
import { LessonBuilder } from './LessonBuilder';
import { Duration, Lesson } from './types';

export type ScheduleParserConfig = {
  dateIndex: number;
  hourIndex: number;
  hourRegex: RegExp;
  lessons: {
    group: Map<number, string>;
    index: number;
  }[];
  yearIndex: number;
  yearRegex: RegExp;
};

export class XlsScheduleParser
  implements ParserInterface<{ lessons: Lesson[]; year: string }>
{
  private readonly config: ScheduleParserConfig;
  private readonly data: (number | string | Date)[][];

  constructor(config: ScheduleParserConfig, scheduleFile: string) {
    this.config = config;
    this.data = new XlsParser<number | string | Date>()
      .parse(scheduleFile)
      .flat()
      .map((sheet) => sheet.data)
      .flat();
  }

  #hasHours(row: (number | string | Date)[]) {
    const hours = row.at(this.config.hourIndex);
    return typeof hours === 'string' && this.config.hourRegex.test(hours);
  }

  parse() {
    return {
      lessons: this.#parseLessons(),
      year: this.#parseYear(),
    };
  }

  #parseDateAndDuration(
    baseDate: Date,
    row: (number | string | Date)[],
  ): [Date, Duration] {
    const date = row.at(this.config.dateIndex);
    const hour = row.at(this.config.hourIndex);

    let hours = 0;
    let minutes = 0;
    let parsedDate = new Date(baseDate);

    if (date instanceof Date) {
      parsedDate = date;
    }

    if (typeof hour === 'string' && this.config.hourRegex.test(hour)) {
      const [startHourString, endHourString] = hour.split('-');

      if (!startHourString || !endHourString) {
        throw Error('Cannot parse: hours incomplete');
      }

      const { hour: endHours, minute: endMinutes } =
        this.#parseHour(endHourString);
      const { hour: startHours, minute: startMinutes } =
        this.#parseHour(startHourString);

      minutes =
        endMinutes - startMinutes < 0
          ? 60 + endMinutes - startMinutes
          : endMinutes - startMinutes;
      hours =
        endMinutes - startMinutes < 0
          ? endHours - startHours - 1
          : endHours - startHours;

      parsedDate.setHours(startHours);
      parsedDate.setMinutes(startMinutes);
    }

    return [parsedDate, { hours, minutes }];
  }

  #parseHour(hourString: string): {
    hour: number;
    minute: number;
  } {
    const [hoursString, minutesString] = hourString.split(':');

    if (!hoursString || !minutesString) {
      throw Error('Cannot parse: hour has incorrect format');
    }

    return {
      hour: parseInt(hoursString),
      minute: parseInt(minutesString),
    };
  }

  #parseLessonDetails(
    row: (number | string | Date)[],
  ): { content: string; group: string }[] {
    const contents = this.config.lessons
      .map(({ group, index }) => ({
        group,
        content: row.at(index),
      }))
      .filter(
        (item): item is { group: Map<number, string>; content: string } =>
          typeof item.content === 'string',
      );

    return contents.map((datum) => ({
      content: datum.content,
      group: datum.group.get(contents.length)!,
    }));
  }

  #parseLessons(): Lesson[] {
    let date: Date = new Date();
    const lessons = this.data.reduce<LessonBuilder[]>((acc, row) => {
      if (!this.#hasHours(row)) {
        return acc;
      }

      const [startsAt, duration] = this.#parseDateAndDuration(date, row);
      date = startsAt;

      const details = this.#parseLessonDetails(row);

      return [
        ...acc,
        ...details.map(({ content, group }) =>
          new LessonBuilder()
            .setDetails(content)
            .setDuration(duration)
            .setGroup(group)
            .setStartsAt(startsAt),
        ),
      ];
    }, []);

    return lessons.map((lesson) => lesson.build());
  }

  #parseYear(): string {
    for (const row of this.data) {
      const year = row.at(this.config.yearIndex);
      if (typeof year === 'string' && this.config.yearRegex.test(year)) {
        return year;
      }
    }

    return '';
  }
}
