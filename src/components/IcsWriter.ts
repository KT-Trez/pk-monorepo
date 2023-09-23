import fs from 'fs';
import * as ics from 'ics';
import { EventAttributes } from 'ics';
import { WriterInterface } from 'types/interfaces';

export class IcsWriter implements WriterInterface<EventAttributes[]> {
  write(events: EventAttributes[], icsPath: string) {
    if (fs.existsSync(icsPath)) {
      fs.rmSync(icsPath);
    }

    const { error, value } = ics.createEvents(events);

    if (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to write ics file');
    }

    if (value) {
      fs.writeFileSync(icsPath, value);
    }
  }
}
