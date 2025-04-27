import type { PermissionsByRole } from './types.js';

export const permissionsByRole: PermissionsByRole = {
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
      delete: (user, userToDelete) => user.uid !== userToDelete?.uid,
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
      delete: false,
      read: (user, userToRead) => user.uid === userToRead?.uid,
      update: (user, userToUpdate) => user.uid === userToUpdate?.uid && !userToUpdate.roles?.includes('admin'),
    },
  },
};
