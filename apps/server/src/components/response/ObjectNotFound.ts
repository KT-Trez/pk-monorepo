import { HttpStatus } from '@pk/types/api.js';
import { ServerError } from '../../../lib/errors/ServerError.ts';

export class ObjectNotFound extends ServerError {
  constructor(object: string, uid: string) {
    const httpStatus = HttpStatus.NotFound;
    const message = `${object.toUpperCase()} (${uid}}) not found`;

    super({ httpStatus, message });
  }
}
