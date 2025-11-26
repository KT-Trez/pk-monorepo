import type { PermissionsByRole } from './types.js';

export const permissionsByRole: PermissionsByRole = {
  admin: {
    calendar: {
      create: true,
      read: true,
    },
    user: {
      create: true,
      read: true,
    },
  },
  member: {
    calendar: {
      create: true,
      read: (user, calendar) => {
        const isCalendarAuthor = calendar?.author.uid === user.uid;
        const isCalendarPublic = !!calendar?.isPublic;
        // const isEditor = calendar?.sharedWith[user.uid] === CalendarShareType.Editor;
        // const isViewer = calendar?.sharedWith[user.uid] === CalendarShareType.Viewer;

        return isCalendarAuthor || isCalendarPublic /* || isEditor || isViewer; */;
      },
    },
    user: {
      create: false,
      read: (user, userToRead) => user.uid === userToRead?.uid,
    },
  },
};
