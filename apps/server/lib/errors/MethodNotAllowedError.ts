import { HttpStatus } from '@pk/types/api.js';
import { ServerError } from './ServerError.ts';

export class MethodNotAllowedError extends ServerError {
  constructor(method: string | undefined) {
    const httpStatus = HttpStatus.MethodNotAllowed;
    const message = `Method "${method}" not allowed`;

    super({ httpStatus, message });
  }
}
