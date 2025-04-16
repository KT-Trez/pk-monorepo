import { type ErrorApi, HttpStatus, type HttpStatuses } from '@pk/types/api.js';
import type { UnknownObject } from '@pk/types/helpers.js';

type ServerErrorArgs = {
  httpStatus?: HttpStatuses;
  message?: string;
  meta?: UnknownObject;
  cause?: unknown;
};

export class ServerError extends Error implements ErrorApi {
  cause?: unknown;
  code: HttpStatuses;
  message: string;
  meta?: UnknownObject;
  success: false;

  constructor(args?: ServerErrorArgs) {
    const message = args?.message ?? 'Error occurred';
    super(message, { cause: args?.cause });

    this.code = args?.httpStatus ?? HttpStatus.InternalServerError;
    this.cause = args?.cause;
    this.message = message;
    this.meta = args?.meta;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON(): ErrorApi {
    return {
      code: this.code,
      message: this.message,
      meta: this.meta,
      success: this.success,
    };
  }
}
