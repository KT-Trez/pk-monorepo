import { HttpStatuses } from '@pk/types/api.js';
import { ServerError } from './ServerError.ts';

export class BadRequestError extends ServerError {
  constructor(messages: string[]) {
    const httpStatus = HttpStatuses.badRequest;
    const message = messages.join('\n');

    super({ httpStatus, message });
  }
}
