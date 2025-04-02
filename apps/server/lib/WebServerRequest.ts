import { IncomingMessage } from 'node:http';
import type { Socket } from 'node:net';

export class WebServerRequest extends IncomingMessage {
  // biome-ignore lint/style/useNamingConvention: URL is a built-in class
  parsedURL: URL;
  #paths: string[] = [];

  constructor(socket: Socket) {
    super(socket);
    this.parsedURL = new URL('', `http://${this.headers.host}`);
  }

  get nextPath() {
    return this.#paths.shift();
  }

  _process() {
    if (!this.url) {
      throw new Error('Request URL is missing');
    }

    const parsedUrl = new URL(this.url, `http://${this.headers.host}`);

    this.#paths = parsedUrl.pathname.split('/').filter(Boolean);
    this.parsedURL = parsedUrl;
  }
}
