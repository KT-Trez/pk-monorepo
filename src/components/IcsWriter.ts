import type { WriterInterfaceV2 } from '@types';
import fs from 'fs';
import { createEvents, type EventAttributes } from 'ics';
import { logger } from '../services/logging.service';

export type IcsWriterV2Config = {
  bufor?: EventAttributes[];
  path?: string;
};

export class IcsWriterV2<TInput> implements WriterInterfaceV2<TInput, EventAttributes[]> {
  bufor: EventAttributes[];
  readonly #path: string;

  constructor({ bufor, path }: IcsWriterV2Config) {
    this.bufor = bufor || [];
    this.#path = path || '';
  }

  write() {
    if (fs.existsSync(this.#path)) {
      fs.rmSync(this.#path);
    }

    const { error, value } = createEvents(this.bufor);

    if (error) {
      logger.log('Failed to write ics file', 'WARNING');
    }

    if (value) {
      fs.writeFileSync(this.#path, value);
    }
  }
}
