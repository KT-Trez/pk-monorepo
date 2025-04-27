import { type IncomingMessage, type OutgoingHttpHeaders, ServerResponse } from 'node:http';
import { HttpStatus, type HttpStatuses } from '@pk/types/api.js';
import { Severity } from '@pk/utils/Logger/types.js';
import { logger } from '../logger/logger.ts';
import type { ServerError } from '../response/ServerError.ts';

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
    logger.log({ message: `MESSAGE - "${error.message}", CAUSE - "${error.cause}"`, severity: Severity.Error });

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
