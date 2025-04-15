import { HttpStatus, type HttpStatuses } from '@pk/types/api.js';
import { type IncomingMessage, type OutgoingHttpHeaders, ServerResponse } from 'node:http';
import type { ServerError } from './errors/ServerError.js';

export class WebServerResponse<Request extends IncomingMessage = IncomingMessage> extends ServerResponse<Request> {
  readonly #headers: OutgoingHttpHeaders;
  #status: HttpStatuses;

  constructor(req: Request) {
    super(req);

    this.#headers = {};
    this.#status = HttpStatus.Ok;
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

    this.setStatus(error.code);
    this.json(error.toJSON());
  }

  json(data: unknown) {
    this.addHeader('Content-Type', 'application/json');
    this.writeHead(this.#status, this.#headers);
    this.end(JSON.stringify(data));
  }

  setStatus(code: HttpStatuses) {
    this.#status = code;

    return this;
  }
}
