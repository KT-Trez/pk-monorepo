import { DateArray, DurationObject, EventAttributes } from 'ics';
import { ClassType, Duration } from '../../types';
import { UniDay } from './UniDay';

export class ClassTypeToIcsEventAdapter {
  description: string; // todo: implement
  duration: DurationObject;
  location: string;
  start: DateArray;
  title: string; // todo: refactor
  // noinspection JSUnusedGlobalSymbols
  geo?: { lat: number; lon: number }; // todo: implement

  constructor(duration: Duration, classT: ClassType, startsAt: Date) {
    this.description = '';
    this.duration = duration;
    this.location = classT.details.match(/s\.\s.*\d/i)?.at(0) ?? '';
    this.start = [
      startsAt.getFullYear(),
      startsAt.getMonth() + 1,
      startsAt.getDate(),
      startsAt.getHours(),
      startsAt.getMinutes(),
    ];
    this.title = classT.details;
  }
}

// todo: make it more readable
export const UniDayToIcsEventAdapter = ({
  classesBlock,
}: UniDay): EventAttributes[] =>
  classesBlock
    .map(({ duration, classes, startsAt }) =>
      classes
        .map(
          (lesson) =>
            new ClassTypeToIcsEventAdapter(
              duration.value,
              lesson,
              startsAt.value,
            ),
        )
        .flat(),
    )
    .flat();
