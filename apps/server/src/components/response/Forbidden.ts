import { HttpStatus } from '@pk/types/api.js';
import { ServerError } from './ServerError.ts';

export class Forbidden extends ServerError {
  constructor(cause?: unknown) {
    const httpStatus = HttpStatus.Forbidden;
    const message = 'This action is forbidden';

    super({ cause, httpStatus, message });
  }
}
