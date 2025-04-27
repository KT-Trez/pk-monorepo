import { HttpStatus } from '@pk/types/api.js';
import { ServerError } from './ServerError.ts';

export class Unauthorized extends ServerError {
  constructor(cause?: unknown, messageOverride?: string) {
    const httpStatus = HttpStatus.Unauthorized;
    const message = messageOverride ?? 'User is unauthorized';

    super({ cause, httpStatus, message });
  }
}
