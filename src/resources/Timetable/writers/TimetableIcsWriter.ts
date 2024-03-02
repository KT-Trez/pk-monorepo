import { IcsWriterV2, type IcsWriterV2Config } from '@components';
import type { Lesson } from '@types';
import type { DateArray, EventAttributes } from 'ics';

type AdapterImplementation = Omit<EventAttributes, 'end' | 'duration'> & { end: DateArray };

class LessonToEventAttributesAdapter implements AdapterImplementation {
  description: string; // todo: refactor
  end: DateArray;
  geo: { lat: number; lon: number } | undefined;
  location: string | undefined;
  start: DateArray;
  startInputType: 'local' | 'utc';
  startOutputType: 'local' | 'utc';
  title: string;

  constructor(lesson: Lesson) {
    this.description = `• ${lesson.group.type} ${lesson.group.number}`; // todo: refactor
    this.end = this.#parseDateArray(lesson.end);
    this.geo = this.#parseLocation(lesson.details);
    this.location = lesson.details.match(/(s\..*[\dn])|zdalnie/i)?.at(0);
    this.start = this.#parseDateArray(lesson.start);
    this.startInputType = 'local';
    this.startOutputType = 'utc';
    this.title = lesson.details;
  }

  #parseDateArray(date: Date): DateArray {
    return [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes()];
  }

  #parseLocation(text: string): { lat: number; lon: number } | undefined {
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

export class TimetableIcsWriter extends IcsWriterV2<Lesson[]> {
  constructor({ bufor, path }: IcsWriterV2Config) {
    super({ bufor, path });
  }

  transform(lessons: Lesson[]): void {
    super.bufor = lessons.map(lesson => new LessonToEventAttributesAdapter(lesson));
  }
}
