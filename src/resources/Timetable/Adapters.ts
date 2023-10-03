import { DateArray, DurationObject, EventAttributes } from 'ics';
import { ClassType, Duration } from '../../types';
import { UniDay } from './UniDay';

export class ClassTypeToIcsEventAdapter {
  description: string; // todo: implement
  duration: DurationObject;
  location: string;
  start: DateArray;
  startOutputType: 'local' | 'utc';
  title: string; // todo: refactor
  geo?: { lat: number; lon: number };

  constructor(duration: Duration, classT: ClassType, startsAt: Date) {
    this.description = '';
    this.duration = duration;
    this.geo = this.#getLocation(classT.details);
    this.location = classT.details.match(/s\.\s.*\d/i)?.at(0) ?? '';
    this.start = [
      startsAt.getFullYear(),
      startsAt.getMonth() + 1,
      startsAt.getDate(),
      startsAt.getHours(),
      startsAt.getMinutes(),
    ];
    this.startOutputType = 'local';
    this.title = classT.details.replace(/\s{2,}/gm, ' ');
  }

  #getLocation(text: string): { lat: number; lon: number } | undefined {
    if (/s\.\s1\/15\s(działownia)?/i.test(text)) {
      return { lat: 50.071879385174384, lon: 19.940171148217036 };
    } else if (/s\.\sn/i.test(text)) {
      return { lat: 50.07191637072032, lon: 19.94249144298537 };
    } else if (/s\.\swykładowa\ski/i.test(text)) {
      return { lat: 50.07134413565708, lon: 19.941532202628903 };
    } else if (/s\.\s(135|136|151)/i.test(text)) {
      return { lat: 50.07134413565708, lon: 19.941532202628903 };
    } else if (/s\.\s131/i.test(text)) {
      return { lat: 50.072286689076265, lon: 19.941586729514107 };
    } else if (/s\.\s(s1|s2|s3|114)/i.test(text)) {
      return { lat: 50.07234216365901, lon: 19.943373874816867 };
    } else if (/s\.\s(f020|f112)/i.test(text)) {
      return { lat: 50.0754775678576, lon: 19.909228008403307 };
    }

    return undefined;
  }
}

// todo: make it more readable
export const UniDayToIcsEventAdapter = ({
  classesBlock,
}: UniDay): EventAttributes[] =>
  classesBlock
    .map(({ duration, classes, startsAt }) =>
      classes
        .filter((classT): classT is ClassType => !!classT)
        .map(
          classT =>
            new ClassTypeToIcsEventAdapter(
              duration.value,
              classT,
              startsAt.value,
            ),
        )
        .flat(),
    )
    .flat();
