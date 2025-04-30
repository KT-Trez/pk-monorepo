import type { EnrichedSessionApi } from '@pk/types/session.js';
import { permissionsByRole } from '@pk/utils/permissions/permissionsByRole.js';
import type { PermissionsByResource } from '@pk/utils/permissions/types.js';
import { enrichedSessionRepository } from '../../main.ts';

export class Session {
  #session: EnrichedSessionApi | null = null;

  get details() {
    if (!this.#session) {
      throw new Error('#session is not initialized, call "constructorAsync()" first');
    }

    return this.#session;
  }

  async constructorAsync(sessionUid: string) {
    const session = await enrichedSessionRepository.findOne(sessionUid);

    if (session) {
      this.#session = session;
    }

    return this;
  }

  hasPermission<R extends keyof PermissionsByResource, A extends keyof PermissionsByResource[R]>(
    resource: R,
    action: A,
    data?: PermissionsByResource[R][A],
  ) {
    if (!this.details.user) {
      return false;
    }

    return this.details.user.roles.some(role => {
      const permission = permissionsByRole[role][resource]?.[action];

      if (permission === undefined) {
        return false;
      }

      if (typeof permission === 'boolean') {
        return permission;
      }

      return permission(this.details.user, data);
    });
  }

  hasSession() {
    return !!this.#session;
  }
}
