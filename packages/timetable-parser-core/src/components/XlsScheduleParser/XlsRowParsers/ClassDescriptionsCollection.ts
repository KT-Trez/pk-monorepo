import { type ClassDescription, GroupType, type GroupTypes } from '../../../types/classInfo.ts';
import type { XlsColumnName } from '../../../types/xls.ts';

export class ClassDescriptionsCollection extends Map<GroupTypes, Map<XlsColumnName, ClassDescription>> {
  constructor() {
    super([
      [GroupType.Exercise, new Map<string, ClassDescription>()],
      [GroupType.Laboratory, new Map<string, ClassDescription>()],
      [GroupType.Language, new Map<string, ClassDescription>()],
      [GroupType.Lecture, new Map<string, ClassDescription>()],
      [GroupType.Unknown, new Map<string, ClassDescription>()],
    ]);
  }
}
