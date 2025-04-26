import type { EnrichedSessionApi } from '@pk/types/session.js';
import { enrichedSessionRepository } from '../../main.ts';
import type { PermissionsByResource, PermissionsByRole } from '../../types/permissions.ts';

export class Session {
  static #permissionsByResource: PermissionsByRole = {
    admin: {
      calendar: {
        create: true,
        delete: true,
        read: true,
        update: true,
      },
      event: {
        create: true,
        delete: true,
        read: true,
        update: true,
      },
      user: {
        create: true,
        delete: true,
        read: true,
        update: true,
      },
    },
    member: {
      calendar: {
        create: true,
        delete: (user, calendar) => calendar?.author_uid === user.uid,
        read: (user, calendar) =>
          calendar?.author_uid === user.uid ||
          calendar?.is_public ||
          calendar?.shared_with[user.uid] === 'editor' ||
          calendar?.shared_with[user.uid] === 'viewer',
        update: (user, calendar) => calendar?.author_uid === user.uid || calendar?.shared_with[user.uid] === 'editor',
      },
      event: {
        create: (user, event) => {
          const hasEditorPermissions = event?.calendar.shared_with[user.uid] === 'editor';
          const isCalendarPublic = event?.calendar.is_public;
          const isEventAuthor = event?.calendar.author_uid === user.uid;

          return isCalendarPublic || isEventAuthor || hasEditorPermissions;
        },
        delete: (user, event) => event?.calendar.author_uid === user.uid,
        read: (user, event) => {
          const isCalendarPublic = event?.calendar.is_public;
          const isEventAuthor = event?.calendar.author_uid === user.uid;
          const isEventSharedWithUser =
            event?.calendar.shared_with[user.uid] === 'editor' || event?.calendar.shared_with[user.uid] === 'viewer';

          return isCalendarPublic || isEventAuthor || isEventSharedWithUser;
        },
        update: (user, event) => {
          const hasEditorPermissions = event?.calendar.shared_with[user.uid] === 'editor';
          const isEventAuthor = event?.calendar.author_uid === user.uid;

          return isEventAuthor || hasEditorPermissions;
        },
      },
      user: {
        create: false,
        delete: (user, userToDelete) => user.uid === userToDelete?.uid,
        read: (user, userToRead) => user.uid === userToRead?.uid,
        update: (user, userToUpdate) => user.uid === userToUpdate?.uid && !userToUpdate.roles?.includes('admin'),
      },
    },
  };

  #session: EnrichedSessionApi | null = null;

  get session() {
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
    if (!this.session.user) {
      return false;
    }

    return this.session.user.roles.some(role => {
      const permission = Session.#permissionsByResource[role][resource]?.[action];

      if (permission === undefined) {
        return false;
      }

      if (typeof permission === 'boolean') {
        return permission;
      }

      return permission(this.session.user, data);
    });
  }

  hasSession() {
    return !!this.#session;
  }
}
