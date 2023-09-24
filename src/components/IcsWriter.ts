import fs from 'fs';
import { createEvents, EventAttributes } from 'ics';
import { WriterInterface } from 'types';

export class IcsWriter implements WriterInterface<EventAttributes[]> {
  write(events: EventAttributes[], icsPath: string) {
    if (fs.existsSync(icsPath)) {
      fs.rmSync(icsPath);
    }

    const { error, value } = createEvents(events);

    if (error) {
      console.warn('Failed to write ics file');
    }

    if (value) {
      fs.writeFileSync(icsPath, value);
    }
  }
}
