import { exhaustiveCheck } from '@pk/utils/exhaustiveCheck.js';

export type DateFormat = 'date' | 'datetime' | 'daymonth' | 'time' | undefined;

export class DateFormatter {
  static #dateFormatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  static #dateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
    minute: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  static #dayMonthFormatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
  });

  static #timeFormatter = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    hourCycle: 'h23',
    minute: '2-digit',
  });
  formatter!: Intl.DateTimeFormat;

  constructor(format: DateFormat) {
    switch (format) {
      case 'date':
        this.formatter = DateFormatter.#dateFormatter;
        break;
      case 'datetime':
        this.formatter = DateFormatter.#dateTimeFormatter;
        break;
      case 'daymonth':
        this.formatter = DateFormatter.#dayMonthFormatter;
        break;
      case 'time':
        this.formatter = DateFormatter.#timeFormatter;
        break;
      case undefined:
        this.formatter = DateFormatter.#dateTimeFormatter;
        break;
      default:
        exhaustiveCheck(format);
    }
  }

  static parseDate(date: string | Date): Date {
    return date instanceof Date ? date : new Date(date);
  }
}
