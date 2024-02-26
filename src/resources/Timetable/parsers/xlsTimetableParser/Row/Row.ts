import type { EndStartTime, RowType } from '@types';
import { LessonTime } from '../LessonTime';
import { defaultRowConfig } from './constants';
import type { RowConfig } from './types';

export class Row {
  readonly #config: RowConfig = defaultRowConfig;
  readonly #content: RowType = [];

  constructor(data: RowType, config?: RowConfig) {
    if (config) {
      this.#config = config;
    }
    this.#content = data;
  }

  get isValid(): boolean {
    return this.#content.length !== 0;
  }

  getDate(): Date {
    const dateContent = this.#content.at(this.#config.dateIndex);

    return dateContent instanceof Date ? dateContent : new Date(0);
  }

  getHour(): EndStartTime {
    return new LessonTime(this.#content, this.#config.hourIndex, this.#config.hourRegExp);
  }

  hasDate(): boolean {
    const dateContent = this.#content.at(this.#config.dateIndex);

    return dateContent instanceof Date;
  }

  hasHour(): boolean {
    const hourContent = this.#content.at(this.#config.hourIndex);
    if (typeof hourContent !== 'string') {
      return false;
    }

    return this.#config.hourRegExp.test(hourContent);
  }

  readContent(readIndex: number): null | string {
    const item = this.#content.at(readIndex);
    if (typeof item !== 'string') {
      return null;
    }

    return item.replace(/\s{2}/g, ' ');
  }
}
