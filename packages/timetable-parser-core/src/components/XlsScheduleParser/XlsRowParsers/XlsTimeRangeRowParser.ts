import { parse } from 'date-fns';
import type { XlsRowData } from '../../../types/xls.ts';
import type { XlsRowParserStrategy } from '../xlsRowParserStrategy.ts';
import { CLASSES_AND_TIME_RANGE_REGEX } from './regexes.ts';

export class XlsTimeRangeRowParser implements XlsRowParserStrategy<{ end: Date; start: Date } | null> {
  static readonly #dateFallback = new Date(Number.POSITIVE_INFINITY);
  static readonly #timeRangeColumn = 'B';
  static readonly #timeRangeFormat = 'HH.mm';
  static readonly #timeRangeRegex = CLASSES_AND_TIME_RANGE_REGEX;
  static readonly #timeRangeSeparator = '-';

  readonly #referenceDate: Date;

  constructor(referenceDate: Date) {
    this.#referenceDate = referenceDate;
  }

  parse(row: XlsRowData) {
    const timeRange = row[XlsTimeRangeRowParser.#timeRangeColumn];

    if (typeof timeRange !== 'string' || !XlsTimeRangeRowParser.#timeRangeRegex.test(timeRange)) {
      return null;
    }

    return this.#parse(timeRange);
  }

  #parse(timeRange: string) {
    const [startTime, endTime] = timeRange.split(XlsTimeRangeRowParser.#timeRangeSeparator);

    if (!(startTime && endTime)) {
      return { end: XlsTimeRangeRowParser.#dateFallback, start: XlsTimeRangeRowParser.#dateFallback };
    }

    return {
      end: parse(endTime.trim(), XlsTimeRangeRowParser.#timeRangeFormat, this.#referenceDate),
      start: parse(startTime.trim(), XlsTimeRangeRowParser.#timeRangeFormat, this.#referenceDate),
    };
  }
}
