import { GroupType } from '@types';
import type { GroupQuery } from './types';

export const groupsQuery: GroupQuery[] = [
  { [GroupType.EXERCISE]: 1, [GroupType.LABORATORY]: 1 },
  { [GroupType.EXERCISE]: 1, [GroupType.LABORATORY]: 2 },
  { [GroupType.EXERCISE]: 2, [GroupType.LABORATORY]: 3 },
  { [GroupType.EXERCISE]: 2, [GroupType.LABORATORY]: 4 },
];
