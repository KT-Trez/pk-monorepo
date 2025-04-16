import { HttpStatus } from '@pk/types/api.js';
import { ServerError } from './ServerError.ts';

export class Unauthorized extends ServerError {
  constructor(cause?: unknown) {
    const httpStatus = HttpStatus.Unauthorized;
    const message = 'User is unauthorized';

    super({ cause, httpStatus, message });
  }
}

