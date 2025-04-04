import { IncomingMessage } from 'node:http';
import type { Socket } from 'node:net';

export class WebServerRequest extends IncomingMessage {
  // biome-ignore lint/style/useNamingConvention: URL is a built-in class
  #parsedURL: URL;
  #paths: string[] = [];

  constructor(socket: Socket) {
    super(socket);
    this.#parsedURL = new URL('', `http://${this.headers.host}`);
  }

  getOptionalSearchParam(name: string) {
    return this.#parsedURL.searchParams.get(name);
  }

  getSearchParam(name: string) {
    const param = this.#parsedURL.searchParams.get(name);

    if (param === null) {
      throw new Error(`search parameter "${name}" is missing`);
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
  }
}
