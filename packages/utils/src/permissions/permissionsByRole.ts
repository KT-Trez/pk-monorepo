import { CalendarShareType } from '@pk/types/calendar.js';
import type { PermissionsByRole } from './types.js';

export const permissionsByRole: PermissionsByRole = {
  admin: {
    calendar: {
      create: true,
      delete: true,
      follow: (user, calendar) => {
        const isCalendarAuthor = calendar?.authorUid === user.uid;
        const isAlreadyFollowing = !!calendar?.sharedWith[user.uid];

        return !(isCalendarAuthor || isAlreadyFollowing);
      },
      read: true,
      share: true,
      unfollow: (user, calendar) => {
        const isCalendarAuthor = calendar?.authorUid === user.uid;
        const isAlreadyFollowing = !!calendar?.sharedWith[user.uid];

        return !isCalendarAuthor && isAlreadyFollowing;
      },
      update: true,
    },
    event: {
      create: true,
      delete: true,
      read: true,
      update: true,
    },
    options: {
      calendar: true,
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
      follow: (user, calendar) => {
        const isCalendarAuthor = calendar?.authorUid === user.uid;
        const isCalendarPublic = !!calendar?.isPublic;
        const isAlreadyFollowing = !!calendar?.sharedWith[user.uid];

        return !isCalendarAuthor && isCalendarPublic && !isAlreadyFollowing;
      },
      read: (user, calendar) => {
        const isCalendarAuthor = calendar?.authorUid === user.uid;
        const isCalendarPublic = calendar?.isPublic;
        const isEditor = calendar?.sharedWith[user.uid] === CalendarShareType.Editor;
        const isViewer = calendar?.sharedWith[user.uid] === CalendarShareType.Viewer;

        return isCalendarAuthor || isCalendarPublic || isEditor || isViewer;
      },
      share: (user, calendar) => user.uid === calendar?.authorUid,
      unfollow: (user, calendar) => {
        const isCalendarAuthor = calendar?.authorUid === user.uid;
        const isCalendarPublic = !!calendar?.isPublic;
        const isAlreadyFollowing = !!calendar?.sharedWith[user.uid];

        return !isCalendarAuthor && isCalendarPublic && isAlreadyFollowing;
      },
      update: (user, calendar) => {
        const isCalendarAuthor = calendar?.authorUid === user.uid;
        const isEditor = calendar?.sharedWith[user.uid] === CalendarShareType.Editor;

        return isCalendarAuthor || isEditor;
      },
    },
    event: {
      create: true,
      delete: (user, { calendar, event } = {}) => {
        const isCalendarAuthor = calendar?.authorUid === user.uid;
        const isEventAuthor = event?.authorUid === user.uid;

        return isCalendarAuthor || isEventAuthor;
      },
      read: (user, { calendar, event } = {}) => {
        const isCalendarAuthor = calendar?.authorUid === user.uid;
        const isEditor = calendar?.sharedWith[user.uid] === CalendarShareType.Editor;
        const isViewer = calendar?.sharedWith[user.uid] === CalendarShareType.Viewer;
        const isEventAuthor = event?.authorUid === user.uid;

        return isCalendarAuthor || isEditor || isViewer || isEventAuthor;
      },
      update: (user, { calendar, event } = {}) => {
        const isCalendarAuthor = calendar?.authorUid === user.uid;
        const isEditor = calendar?.sharedWith[user.uid] === CalendarShareType.Editor;
        const isEventAuthor = event?.authorUid === user.uid;

        return isCalendarAuthor || isEditor || isEventAuthor;
      },
    },
    options: {
      calendar: (user, calendar) => {
        const isCalendarAuthor = calendar?.authorUid === user.uid;
        const isEditor = calendar?.sharedWith[user.uid] === CalendarShareType.Editor;

        return isCalendarAuthor || isEditor;
      },
    },
    user: {
      create: false,
      delete: false,
      read: (user, userToRead) => user.uid === userToRead?.uid,
      update: (user, userToUpdate) => user.uid === userToUpdate?.uid,
    },
  },
};
