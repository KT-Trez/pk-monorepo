import { Transform, type TransformCallback } from 'node:stream';
import BufferEncoding = NodeJS.BufferEncoding;

export class JsonArrayWriter extends Transform {
  #isFirstIteration: boolean;

  constructor() {
    super({ objectMode: true });
    this.#isFirstIteration = true;
  }

  _final(callback: (error?: Error | null) => void) {
    this.push(']');
    callback();
  }

  _transform(chunk: unknown, _: BufferEncoding, callback: TransformCallback) {
    if (this.#isFirstIteration) {
      this.#isFirstIteration = false;
      this.push('[');
    } else {
      this.push(',');
    }

    try {
      this.push(JSON.stringify(chunk));
      callback();
    } catch (err) {
      if (err instanceof Error) {
        callback(err);
      } else {
        const error = new Error('Failed to stringify chunk', { cause: err });
        // todo: implement backpressure
        callback(error);
      }
    }
  }
}
