import { type ErrorApi, type HttpStatus, HttpStatuses } from '@pk/types/api.js';
import type { UnknownObject } from '@pk/types/helpers.js';

type ServerErrorArgs = {
  httpStatus?: HttpStatus;
  message?: string;
  meta?: UnknownObject;
  cause?: unknown;
};

export class ServerError extends Error implements ErrorApi {
  httpStatus: HttpStatus;
  message: string;
  meta?: UnknownObject;
  cause?: unknown;

  constructor(args?: ServerErrorArgs) {
    const message = args?.message ?? 'Internal server error';

    super(message, { cause: args?.cause });

    this.httpStatus = args?.httpStatus ?? HttpStatuses.internalServerError;
    this.message = message;
    this.meta = args?.meta;
    this.cause = args?.cause;

    Error.captureStackTrace(this, this.constructor);
  }
}
