import { Duration, Lesson } from '../../types';

export class LessonBuilder {
  constructor() {
    this._duration = { hours: 0, minutes: 0 };
    this._group = '';
    this._details = '';
    this._startsAt = new Date(0);
  }

  private _details: string;

  get details(): string {
    return this._details;
  }

  private _duration: Duration;

  get duration(): { hours: number; minutes: number } {
    return this._duration;
  }

  private _group: string;

  get group(): string {
    return this._group;
  }

  private _startsAt: Date;

  get startsAt(): Date {
    return this._startsAt;
  }

  build(): Lesson {
    return Object.freeze({
      details: this.details,
      duration: this.duration,
      group: this.group,
      startsAt: this.startsAt,
    });
  }

  setDetails(details: string) {
    this._details = details;
    return this;
  }

  setDuration(duration: Duration) {
    this._duration = duration;
    return this;
  }

  setGroup(group: string) {
    this._group = group;
    return this;
  }

  setStartsAt(date: Date) {
    this._startsAt = date;
    return this;
  }
}
