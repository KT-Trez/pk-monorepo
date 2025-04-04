import { HttpStatuses } from '@pk/types/api.js';
import { ServerError } from './ServerError.ts';

export class NotFoundError extends ServerError {
  constructor(resource: string) {
    const httpStatus = HttpStatuses.notFound;
    const message = `Resource not found: ${resource}`;

    super({ httpStatus, message });
  }
}
