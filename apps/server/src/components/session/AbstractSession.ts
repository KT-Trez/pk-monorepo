import type { HttpStatuses } from '@pk/types/api.js';
import type { SessionApi } from '@pk/types/session.js';
import type { ServerError } from '../response/ServerError.ts';

export abstract class AbstractSession {
  abstract code: HttpStatuses;

  abstract toResponse(): ServerError | SessionApi;
}
