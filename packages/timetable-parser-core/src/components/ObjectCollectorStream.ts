import { Writable } from 'node:stream';

export class ObjectCollectorStream<T> extends Writable {
  readonly #collection: T[];

  constructor(collection: T[]) {
    super({ objectMode: true });

    this.#collection = collection;
  }

  _write(chunk: T, _: BufferEncoding, callback: (error?: Error | null) => void) {
    this.#collection.push(chunk);
    callback();
  }
}
