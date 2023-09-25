import { DateArray, DurationObject, EventAttributes } from 'ics';
import { Duration, LessonType } from '../../types';
import { SchoolDay } from './SchoolDay';

export class LessonTypeToIcsAdapter {
  description: string; // todo: implement
  duration: DurationObject;
  location: string;
  start: DateArray;
  title: string; // todo: refactor
  // noinspection JSUnusedGlobalSymbols
  geo?: { lat: number; lon: number }; // todo: implement

  constructor(duration: Duration, lesson: LessonType, startsAt: Date) {
    this.description = '';
    this.duration = duration;
    this.location = lesson.details.match(/s\.\s.*\d/i)?.at(0) ?? '';
    this.start = [
      startsAt.getFullYear(),
      startsAt.getMonth() + 1,
      startsAt.getDate(),
      startsAt.getHours(),
      startsAt.getMinutes(),
    ];
    this.title = lesson.details;
  }
}

// todo: make it more readable
export const SchoolDayToIcsAdapter = ({
  lessonBlock,
}: SchoolDay): EventAttributes[] =>
  lessonBlock
    .map(({ duration, lessons, startsAt }) =>
      lessons
        .map(
          (lesson) =>
            new LessonTypeToIcsAdapter(duration.value, lesson, startsAt.value),
        )
        .flat(),
    )
    .flat();
