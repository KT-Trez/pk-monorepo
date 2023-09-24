import { DateArray, DurationObject } from 'ics';
import { Lesson } from '../../types';

export class LessonToIcsAdapter {
  description: string; // todo: implement
  duration: DurationObject;
  location: string;
  start: DateArray;
  title: string; // todo: refactor
  geo?: { lat: number; lon: number }; // todo: implement

  constructor(lesson: Lesson) {
    this.description = '';
    this.duration = lesson.duration;
    this.location = lesson.details.match(/s\.\s.*\d/i)?.at(0) ?? '';
    this.start = [
      lesson.startsAt.getFullYear(),
      lesson.startsAt.getMonth() + 1,
      lesson.startsAt.getDate(),
      lesson.startsAt.getHours(),
      lesson.startsAt.getMinutes(),
    ];
    this.title = lesson.details;
  }
}
