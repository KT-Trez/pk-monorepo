import type { WriterInterfaceV2 } from '@types';
import fs from 'fs';

export type JsonWriterConfig<TOutput> = {
  data?: TOutput;
  path?: string;
};

export class JsonWriter<TInput, TOutput extends Array<Record<string, unknown>> | Record<string, unknown>>
  implements WriterInterfaceV2<TInput, TOutput>
{
  bufor: TOutput;
  readonly #path: string;

  constructor({ data, path }: JsonWriterConfig<TOutput>) {
    this.bufor = data || ({} as TOutput);
    this.#path = path || '';
  }

  write() {
    if (fs.existsSync(this.#path)) {
      fs.rmSync(this.#path);
    }

    fs.writeFileSync(this.#path, JSON.stringify(this.bufor), { encoding: 'utf-8' });
  }
}
