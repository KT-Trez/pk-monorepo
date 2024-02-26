import fs from 'fs';
import { createEvents, EventAttributes } from 'ics';
import { logger } from '../services/logging.service';
import { WriterInterface } from '../types';

export class IcsWriter implements WriterInterface<EventAttributes[]> {
  write(events: EventAttributes[], icsPath: string) {
    if (fs.existsSync(icsPath)) {
      fs.rmSync(icsPath);
    }

    const { error, value } = createEvents(events);

    if (error) {
      logger.log('Failed to write ics file', 'WARNING');
    }

    if (value) {
      fs.writeFileSync(icsPath, value);
    }
  }
}
