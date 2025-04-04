import { ServerError } from './ServerError.ts';

export class MethodNotAllowedError extends ServerError {
  constructor(method: string | undefined) {
    const httpStatus = 405;
    const message = `Method "${method}" not allowed`;

    super({ httpStatus, message });
  }
}
