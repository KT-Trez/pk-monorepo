import type { ClassInfo } from '@pk/timetable-parser-core/classInfo.js';
import type { EventApi } from '@pk/types/event.js';
import type { FullUserApi } from '@pk/types/user.js';
import { getGroupName } from './getGroupName.ts';

export const classInfoToEventApi = (
  classInfo: ClassInfo,
  calendarNameByUid: Record<string, string>,
  serviceUser: FullUserApi,
): Partial<EventApi> => {
  const groupName = getGroupName(classInfo.group);

  const authorUid = serviceUser.uid;
  const calendarUid = calendarNameByUid[groupName];
  const description = classInfo.details;
  const endDate = classInfo.endsAt.toISOString();
  const location = classInfo.location;
  const startDate = classInfo.startsAt.toISOString();
  const title = `${classInfo.group.type}${classInfo.group.index}`;

  if (!calendarUid) {
    throw new Error(`Calendar UID not found for group name: ${groupName}`);
  }

  return {
    authorUid,
    calendarUid,
    description,
    endDate,
    location,
    startDate,
    title,
  };
};
