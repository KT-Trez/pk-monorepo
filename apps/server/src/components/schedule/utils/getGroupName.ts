import type { ClassInfo } from '@pk/timetable-parser-core/classInfo.js';

export const getGroupName = (group: ClassInfo['group']) => {
  return `${group.year} - ${group.type}${group.index}`;
};
