import { CalendarShareType } from '@pk/types/calendar.js';
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
      delete: (user, calendar) => calendar?.authorUid === user.uid,
      read: (user, calendar) => {
        const isAuthor = calendar?.authorUid === user.uid;
        const isCalendarPublic = calendar?.isPublic;
        const isEditor = calendar?.sharedWith[user.uid] === CalendarShareType.Editor;
        const isViewer = calendar?.sharedWith[user.uid] === CalendarShareType.Viewer;

        return isAuthor || isCalendarPublic || isEditor || isViewer;
      },
      update: (user, calendar) => {
        const isAuthor = calendar?.authorUid === user.uid;
        const isEditor = calendar?.sharedWith[user.uid] === CalendarShareType.Editor;

        return isAuthor || isEditor;
      },
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
