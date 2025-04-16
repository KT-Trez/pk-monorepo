import { createSession } from '../../queries/session.ts';
import { selectUserByEmail } from '../../queries/user.ts';
import { Hash } from '../web/Hash.ts';
import type { AbstractSession } from './AbstractSession.ts';
import { AuthorizedSession } from './AuthorizedSession.ts';
import { UnauthorizedSession } from './UnauthorizedSession.ts';

export class SessionFactory {
  #email: string;
  #password: string;

  constructor(email: string, password: string) {
    this.#email = email;
    this.#password = password;
  }

  async constructorAsync(): Promise<AbstractSession> {
    const { rows } = await selectUserByEmail(this.#email);
    const user = rows.at(0);

    if (!user) {
      return new UnauthorizedSession('email', this.#email);
    }

    const passwordHash = await Hash.instance.hashPassword(this.#password);
    const hasMatchingPassword = passwordHash.equals(user.password);

    if (!hasMatchingPassword) {
      return new UnauthorizedSession('password', this.#password);
    }

    await createSession(user.user_uid);

    return new AuthorizedSession(user.user_uid).constructorAsync();
  }
}
