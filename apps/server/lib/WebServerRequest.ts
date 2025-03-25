import { IncomingMessage } from 'node:http';
import type { Socket } from 'node:net';

export class WebServerRequest extends IncomingMessage {
  #pathsToMatch: string[] = [];

  constructor(socket: Socket) {
    super(socket);

    const url = new URL(this.url || '', 'http://localhost');
    this.#pathsToMatch = this.url ? url.pathname.split('/') : [];
  }

  get nextPath() {
    return this.#pathsToMatch.shift();
  }
}
