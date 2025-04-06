import { IncomingMessage } from 'node:http';
import type { Socket } from 'node:net';

export class WebServerRequest extends IncomingMessage {
  #parsedURL: URL;
  #paths: string[] = [];
  #rawData: unknown;

  constructor(socket: Socket) {
    super(socket);
    this.#parsedURL = new URL('', `http://${this.headers.host}`);
    this.#rawData = '';

    this.on('data', chunk => {
      this.#rawData += chunk;
    });
  }

  get body() {
    if (!this.#rawData) {
      return Object.freeze({});
    }

    return Object.freeze(JSON.parse(this.#rawData.toString()));
  }

  get parsedURL(): URL {
    return Object.freeze(this.#parsedURL);
  }

  getBody<T>(): T {
    const body = this.#rawData;

    if (!body) {
      throw new Error('Request body is missing');
    }

    return JSON.parse(body.toString()) as T;
  }

  getOptionalSearchParam(name: string) {
    return this.#parsedURL.searchParams.get(name);
  }

  getSearchParam(name: string) {
    const param = this.#parsedURL.searchParams.get(name);

    if (param === null) {
      throw new Error(`Request search parameter "${name}" is missing`);
    }

    return param;
  }

  _getNextPath() {
    return this.#paths.shift();
  }

  _process() {
    if (!this.url) {
      throw new Error('Request URL is missing');
    }

    this.#parsedURL = new URL(this.url, `http://${this.headers.host}`);
    this.#paths = this.#parsedURL.pathname.split('/').filter(Boolean);

    return new Promise((resolve, reject) => {
      this.once('end', () => {
        resolve(true);
      });

      this.once('error', err => {
        reject(err);
      });
    });
  }
}
