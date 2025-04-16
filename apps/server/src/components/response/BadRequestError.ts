import { HttpStatus } from '@pk/types/api.js';
import { ServerError } from './ServerError.ts';

export class BadRequestError extends ServerError {
  constructor(errors: string[], resource: string) {
    const httpStatus = HttpStatus.BadRequest;
    const message = `${resource} | errors:\n • ${errors.join('\n • ')}`;

    super({ httpStatus, message });
  }
}
