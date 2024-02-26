import { type Group, GroupType, type GroupTypeValues, type RowType } from '@types';

export type GroupRegexesConfig = Record<Exclude<GroupTypeValues, typeof GroupType.UNKNOWN>, RegExp[]>;

export type GroupsMapKey = `${GroupTypeValues}-${number}` | typeof GroupType.UNKNOWN;

export type GroupsParserArgs = RowType;

export type GroupsParserReturn = {
  groupsIndexes: number[];
  groupsMap: Map<GroupsMapKey, Group>;
};
