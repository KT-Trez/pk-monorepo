import { HttpStatuses } from '@pk/types/api.js';
import { ServerError } from './ServerError.ts';

export class BadRequestError extends ServerError {
  constructor(errors: string[], resource: string) {
    const httpStatus = HttpStatuses.badRequest;
    const message = `${resource} | errors:\n • ${errors.join('\n • ')}`;

    super({ httpStatus, message });
  }
}
