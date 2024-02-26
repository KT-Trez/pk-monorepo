import { JsonWriter, type JsonWriterConfig } from '@components';
import type { Lesson } from '@types';

export class TimetableJsonWriter extends JsonWriter<Lesson[], Array<Record<string, unknown>>> {
  constructor({ data, path }: JsonWriterConfig<Array<Record<string, unknown>>>) {
    super({ data, path });
  }

  transform(lessons: Lesson[]): void {
    super.bufor = lessons;
  }
}
