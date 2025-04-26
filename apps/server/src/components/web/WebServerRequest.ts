import { parseCookies } from '@pk/utils/cookies.js';
import { IncomingMessage } from 'node:http';
import type { Socket } from 'node:net';
import { Session } from './Session.ts';

export class WebServerRequest extends IncomingMessage {
  #parsedURL: URL;
  #rawData: unknown;
  #session: Session | null;

  constructor(socket: Socket) {
    super(socket);
    this.#parsedURL = new URL('', `http://${this.headers.host}`);
    this.#rawData = '';
    this.#session = null;

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

  get session(): Readonly<Session> {
    if (!this.#session) {
      throw new Error('Session is missing');
    }

    return Object.freeze(this.#session);
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

  _process() {
    if (!this.url) {
      throw new Error('Request URL is missing');
    }

    this.#parsedURL = new URL(this.url, `http://${this.headers.host}`);

    return new Promise((resolve, reject) => {
      this.once('end', () => {
        resolve(true);
      });

      this.once('error', err => {
        reject(err);
      });
    });
  }

  async _processSession() {
    if (!this.headers.cookie) {
      return false;
    }

    const cookies = parseCookies(this.headers.cookie);
    const sessionUid = cookies.session_uid;

    if (sessionUid) {
      this.#session = await new Session().constructorAsync(sessionUid);
      return this.#session.hasSession();
    }

    return false;
  }
}
