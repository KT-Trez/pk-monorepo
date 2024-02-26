import { type Group, GroupType, type GroupTypeValues } from '@types';

export type Groups = {
  groupsIndexes: number[];
  groupsMap: Map<GroupTypeAndRowIndexKey, Group>;
};

export type GroupTypeAndRowIndexKey =
  | `${GroupTypeValues}-${number}`
  | typeof GroupType.UNKNOWN;
