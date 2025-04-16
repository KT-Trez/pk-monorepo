import { HttpStatus } from '@pk/types/api.js';
import { ServerError } from './ServerError.ts';

export class NotFoundError extends ServerError {
  constructor(resource: string) {
    const httpStatus = HttpStatus.NotFound;
    const message = `"${resource}" not found`;

    super({ httpStatus, message });
  }
}
