import { Transform, type TransformCallback } from 'node:stream';
import { Day } from '@/models/Day';
import { Lesson } from '@/models/Lesson';
import type { Duration, PartialExcept } from '@/types/helpers';
import { Severity } from '@/types/severity';
import type { LogStrategy } from '@/types/strategies';
import { GroupType, type GroupTypes, type Lesson as ILesson, type Lessons } from '@/types/timetable';
import type { CellData } from '@/types/xls';
import { differenceInMinutes, format, parse } from 'date-fns';
import BufferEncoding = NodeJS.BufferEncoding;

const EXERCISE_REGEX = /[cć]w(iczenia)?/i;
const LABORATORY_REGEX = /lab(oratorium)?|projekt\s+zespo[lł]owy/i;
const LANGUAGE_REGEX = /ang(gielski)?/i;
const LECTURE_REGEX = /wyk([lł]ad)?/i;
const UNKNOWN_REGEX = /.*/;
const GROUP_ROW_REGEX = /sobota|niedziela/i;
const TIME_REGEX = /\d?\d:\d\d-\d?\d:\d\d/i;

type XlsTimetableParserOptions = {
  dateColumn: string;
  groupColumn: string;
  groupRegexes: Partial<Record<GroupTypes, RegExp>>;
  groupRowRegex: RegExp;
  logger: LogStrategy;
  timeRangeColumn: string;
  timeRangeFormat: string;
  timeRangeRegex: RegExp;
};

export class XlsTimetableParser extends Transform {
  // parsing config
  readonly #dateColumn: string;
  readonly #groupColumn: string;
  readonly groupRegexes: Record<GroupTypes, RegExp>;
  readonly #groupRowRegex: RegExp;
  readonly #logger: LogStrategy;
  readonly #timeRangeColumn: string;
  readonly #timeRangeFormat: string;
  readonly #timeRangeRegex: RegExp;

  // parsing state
  #chunk: CellData;
  #date: Date;
  #day: Day | null;
  #groups: Record<GroupTypes, Record<string, { index: number; year: number }>>;
  #timeRange: string;

  constructor({
    dateColumn,
    groupColumn,
    groupRegexes,
    groupRowRegex,
    logger,
    timeRangeColumn,
    timeRangeFormat,
    timeRangeRegex,
  }: PartialExcept<XlsTimetableParserOptions, 'logger'>) {
    super({ objectMode: true });

    // parsing config
    this.#dateColumn = dateColumn ?? 'A';
    this.#groupColumn = groupColumn ?? 'B';
    this.groupRegexes = {
      [GroupType.EXERCISE]: groupRegexes?.[GroupType.EXERCISE] ?? EXERCISE_REGEX,
      [GroupType.LABORATORY]: groupRegexes?.[GroupType.LABORATORY] ?? LABORATORY_REGEX,
      [GroupType.LANGUAGE]: groupRegexes?.[GroupType.LANGUAGE] ?? LANGUAGE_REGEX,
      [GroupType.LECTURE]: groupRegexes?.[GroupType.LECTURE] ?? LECTURE_REGEX,
      [GroupType.UNKNOWN]: groupRegexes?.[GroupType.UNKNOWN] ?? UNKNOWN_REGEX,
    };
    this.#groupRowRegex = groupRowRegex ?? GROUP_ROW_REGEX;
    this.#logger = logger;
    this.#timeRangeColumn = timeRangeColumn ?? 'B';
    this.#timeRangeFormat = timeRangeFormat ?? 'HH:mm';
    this.#timeRangeRegex = timeRangeRegex ?? TIME_REGEX;

    // parsing state
    this.#chunk = {};
    this.#date = new Date();
    this.#day = null;
    this.#groups = {
      [GroupType.EXERCISE]: {},
      [GroupType.LABORATORY]: {},
      [GroupType.LANGUAGE]: {},
      [GroupType.LECTURE]: {},
      [GroupType.UNKNOWN]: {},
    };
    this.#timeRange = '00:00-00:00';
  }

  #parseDate(): Date {
    const [startTime] = this.#timeRange.split('-');

    if (!startTime) {
      return this.#date;
    }

    return parse(startTime, this.#timeRangeFormat, this.#date);
  }

  #parseDuration(): Duration {
    const [startTime, endTime] = this.#timeRange.split('-');

    if (!(startTime && endTime)) {
      return { hours: 0, minutes: 0 };
    }

    const start = parse(startTime, this.#timeRangeFormat, new Date());
    const end = parse(endTime, this.#timeRangeFormat, new Date());

    const difference = differenceInMinutes(end, start);

    return { hours: Math.floor(difference / 60), minutes: difference % 60 };
  }

  // todo: simplify this method
  #parseLesson() {
    const lessons: ILesson[] = [];

    for (const column in this.#chunk) {
      if (column === this.#dateColumn || column === this.#timeRangeColumn) {
        continue;
      }

      const description = this.#chunk[column];
      if (typeof description !== 'string') {
        continue;
      }

      if (this.groupRegexes[GroupType.EXERCISE].test(description)) {
        const index = this.#groups[GroupType.EXERCISE][column]?.index ?? -1;
        const year = this.#groups[GroupType.EXERCISE][column]?.year ?? -1;
        lessons.push(new Lesson(description, index, GroupType.EXERCISE, year));

        continue;
      }

      if (this.groupRegexes[GroupType.LABORATORY].test(description)) {
        const index = this.#groups[GroupType.LABORATORY][column]?.index ?? -1;
        const year = this.#groups[GroupType.LABORATORY][column]?.year ?? -1;
        lessons.push(new Lesson(description, index, GroupType.LABORATORY, year));

        continue;
      }

      if (this.groupRegexes[GroupType.LANGUAGE].test(description)) {
        const index = this.#groups[GroupType.LANGUAGE][column]?.index ?? -1;
        const year = this.#groups[GroupType.LANGUAGE][column]?.year ?? -1;
        lessons.push(new Lesson(description, index, GroupType.LANGUAGE, year));

        continue;
      }

      if (this.groupRegexes[GroupType.LECTURE].test(description)) {
        const index = this.#groups[GroupType.LECTURE][column]?.index ?? -1;
        const year = this.#groups[GroupType.LECTURE][column]?.year ?? -1;
        lessons.push(new Lesson(description, index, GroupType.LECTURE, year));

        continue;
      }

      this.#logger.log(`Unknown group type for description: ${description}`, Severity.WARNING);

      // todo: save unknown group type
    }

    return lessons;
  }

  #parseLessons() {
    const date = this.#parseDate();
    const duration = this.#parseDuration();
    const items = this.#parseLesson();

    const lessons: Lessons = {
      duration: { label: this.#timeRange, value: duration },
      items,
      startsAt: { label: format(date, 'yyyy-MM-dd HH:mm'), value: date },
    };

    if (items.length > 0) {
      this.#day?.addLessons(lessons);
    }
  }

  #parseGroups() {
    for (const column in this.#chunk) {
      if (column === this.#dateColumn || column === this.#timeRangeColumn) {
        continue;
      }

      const group = this.#chunk[column];
      if (typeof group !== 'number') {
        continue;
      }

      const nextColumn = String.fromCharCode(column.charCodeAt(0) + 1);

      const groupString = group.toString();
      const index = Number(groupString[1] ?? -1);
      const year = Number(groupString[0] ?? -1);

      this.#groups[GroupType.EXERCISE][column] = { index, year };

      // groups are indexed from 1, so we need to subtract 1 to get the correct values after multiplication
      this.#groups[GroupType.LABORATORY][column] = { index: (index - 1) * 2 + 1, year };
      this.#groups[GroupType.LABORATORY][nextColumn] = { index: (index - 1) * 2 + 2, year };

      this.#groups[GroupType.LECTURE][column] = { index: 1, year };
      this.#groups[GroupType.LANGUAGE][column] = { index, year };
      this.#groups[GroupType.UNKNOWN][column] = { index: 1, year };
    }
  }

  _transform(chunk: CellData, _: BufferEncoding, callback: TransformCallback) {
    const date = chunk[this.#dateColumn];
    const group = chunk[this.#groupColumn];
    const time = chunk[this.#timeRangeColumn];

    let canPushMoreData = true;

    this.#chunk = chunk;

    if (date instanceof Date) {
      if (this.#day !== null) {
        canPushMoreData = this.push(this.#day);
      }

      this.#date = date;
      this.#day = new Day(date);
    }

    if (typeof group === 'string' && this.#groupRowRegex.test(group)) {
      this.#parseGroups();
    }

    if (typeof time === 'string' && this.#timeRangeRegex.test(time)) {
      this.#timeRange = time;
      this.#parseLessons();
    }

    if (canPushMoreData) {
      callback();
    } else {
      this.once('drain', callback);
    }
  }
}
