import { HttpStatus } from '@pk/types/api.js';
import type { SessionApi, SessionDb } from '@pk/types/session.js';
import { selectSessionByUserUid } from '../../queries/session.ts';
import { AbstractSession } from './AbstractSession.ts';

export class AuthorizedSession extends AbstractSession {
  code = HttpStatus.Ok;

  #session: SessionDb | null = null;
  #userUid: string;

  constructor(userUid: string) {
    super();
    this.#userUid = userUid;
  }

  async constructorAsync() {
    const { rows } = await selectSessionByUserUid(this.#userUid);
    const session = rows.at(0);

    if (!session) {
      throw new Error('Session not found');
    }

    this.#session = session;

    return this;
  }

  toResponse(): SessionApi {
    if (!this.#session) {
      throw new Error('Session not initialized');
    }

    return {
      acl: this.#session.acl.toString(16),
      expiresAt: this.#session.expires_at.toISOString(),
      sessionUid: this.#session.session_uid,
      userUid: this.#session.user_uid,
    };
  }
}
