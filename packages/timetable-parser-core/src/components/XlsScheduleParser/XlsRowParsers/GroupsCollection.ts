import { type Group, GroupType, type GroupTypes } from '../../../types/classInfo.ts';
import type { XlsColumnName } from '../../../types/xls.ts';
import {
  EXERCISE_GROUP_REGEX,
  LABORATORY_GROUP_REGEX,
  LANGUAGE_GROUP_REGEX,
  LECTURE_GROUP_REGEX,
  UNKNOWN_GROUP_REGEX,
} from './regexes.ts';

export class GroupsCollection extends Map<GroupTypes, Map<XlsColumnName, Group>> {
  static readonly groupRegexes: Record<GroupTypes, RegExp> = {
    [GroupType.Exercise]: EXERCISE_GROUP_REGEX,
    [GroupType.Laboratory]: LABORATORY_GROUP_REGEX,
    [GroupType.Language]: LANGUAGE_GROUP_REGEX,
    [GroupType.Lecture]: LECTURE_GROUP_REGEX,
    [GroupType.Unknown]: UNKNOWN_GROUP_REGEX,
  };

  constructor() {
    super([
      [GroupType.Exercise, new Map<string, Group>()],
      [GroupType.Laboratory, new Map<string, Group>()],
      [GroupType.Language, new Map<string, Group>()],
      [GroupType.Lecture, new Map<string, Group>()],
      [GroupType.Unknown, new Map<string, Group>()],
    ]);
  }
}
