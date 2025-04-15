import { HttpStatus } from '@pk/types/api.js';
import type { ServerError } from '../../../lib/errors/ServerError.ts';
import { Unauthorized } from '../../../lib/errors/Unauthorized.ts';
import { AbstractSession } from './AbstractSession.ts';

export class UnauthorizedSession extends AbstractSession {
  code = HttpStatus.Unauthorized;

  #reason: 'email' | 'password';
  #value: string;

  constructor(reason: 'email' | 'password', value: string) {
    super();
    this.#reason = reason;
    this.#value = value;
  }

  toResponse(): ServerError {
    return new Unauthorized(`Invalid ${this.#reason} "${this.#value}"`);
  }
}
