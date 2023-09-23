import { Duration, Lesson } from './types';

export class LessonBuilder {
  get details(): string {
    return this._details;
  }

  get duration(): { hours: number; minutes: number } {
    return this._duration;
  }

  get group(): string {
    return this._group;
  }

  get startsAt(): Date {
    return this._startsAt;
  }

  private _details: string;
  private _duration: Duration;
  private _group: string;
  private _startsAt: Date;

  constructor() {
    this._duration = { hours: 0, minutes: 0 };
    this._group = '';
    this._details = '';
    this._startsAt = new Date(0);
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
