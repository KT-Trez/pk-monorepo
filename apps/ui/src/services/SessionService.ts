import type { EnrichedSessionApi } from '@pk/types/session.js';
import { permissionsByRole } from '@pk/utils/permissions/permissionsByRole.js';
import type { PermissionsByResource } from '@pk/utils/permissions/types.js';

export const SESSION_LOCAL_STORAGE_KEY = '@pk/session';

export class SessionService extends EventTarget {
  #session: EnrichedSessionApi | null = null;

  get session(): EnrichedSessionApi | null {
    if (this.#session) {
      return this.#session;
    }

    const session = localStorage.getItem(SESSION_LOCAL_STORAGE_KEY);

    if (!session) {
      return null;
    }

    const parsedSession: EnrichedSessionApi = JSON.parse(session);
    const isExpired = new Date(parsedSession.expiresAt) <= new Date();

    if (isExpired) {
      this.clear();
      return null;
    }

    this.#session = parsedSession;

    return this.#session;
  }

  set session(session: EnrichedSessionApi) {
    this.#session = session;
    localStorage.setItem(SESSION_LOCAL_STORAGE_KEY, JSON.stringify(session));
  }

  clear() {
    this.#session = null;
    localStorage.removeItem(SESSION_LOCAL_STORAGE_KEY);
  }

  hasPermission<R extends keyof PermissionsByResource, A extends keyof PermissionsByResource[R]>(
    resource: R,
    action: A,
    data?: PermissionsByResource[R][A],
  ) {
    const session = this.session;

    if (!session) {
      return false;
    }

    return session.user.roles.some(role => {
      const permission = permissionsByRole[role][resource]?.[action];

      if (permission === undefined) {
        return false;
      }

      if (typeof permission === 'boolean') {
        return permission;
      }

      return permission(session.user, data);
    });
  }
}
