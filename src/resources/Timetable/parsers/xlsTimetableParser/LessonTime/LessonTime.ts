import type { RowType, Time } from '@types';

export class LessonTime {
  end: Time = { hours: 0, minutes: 0 };
  start: Time = { hours: 0, minutes: 0 };

  constructor(data: RowType, hourIndex: number, hourRegex: RegExp) {
    const hourContent = data.at(hourIndex);
    if (typeof hourContent !== 'string' || !hourRegex.test(hourContent)) {
      return this;
    }

    const normalizedHourContent = hourContent.replace(/\s/gm, '');
    const hourContentParts = normalizedHourContent.split('-');

    const endHourString = hourContentParts.at(1) || '0.00';
    const startHourString = hourContentParts.at(0) || '0.00';

    this.end = this.#parseHourAndMinutes(endHourString);
    this.start = this.#parseHourAndMinutes(startHourString);
  }

  static default(): LessonTime {
    return new LessonTime([], 0, /-/);
  }

  #parseHourAndMinutes(string: string): Time {
    const hourParts = string.split('.');

    const hourString = hourParts.at(0) || 0;
    const minutesString = hourParts.at(1) || 0;

    return {
      hours: Number(hourString),
      minutes: Number(minutesString),
    };
  }
}
