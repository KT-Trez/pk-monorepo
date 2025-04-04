import type { HttpStatus } from '@pk/types/api.js';
import { type IncomingMessage, type OutgoingHttpHeaders, ServerResponse } from 'node:http';
import type { ServerError } from './errors/ServerError.js';

export class WebServerResponse<Request extends IncomingMessage = IncomingMessage> extends ServerResponse<Request> {
  readonly #headers: OutgoingHttpHeaders;
  #status: HttpStatus;

  constructor(req: Request) {
    super(req);

    this.#headers = {};
    this.#status = 200;
  }

  addHeader(name: string, value: string | number | string[]) {
    this.#headers[name] = value;

    return this;
  }

  error(error: ServerError) {
    // todo: use logger
    // biome-ignore lint/suspicious/noConsole: needed for error handling
    console.error(`[ERROR] ${error.message} [CAUSE]`, error.cause);

    if (this.headersSent) {
      return;
    }

    this.setStatus(error.httpStatus);
    this.json(error);
  }

  json(data: unknown) {
    this.addHeader('Content-Type', 'application/json');
    this.writeHead(this.#status, this.#headers);
    this.end(JSON.stringify(data));
  }

  setStatus(code: HttpStatus) {
    this.#status = code;

    return this;
  }
}
