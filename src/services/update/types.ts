import { GroupType } from '@types';

export type GroupQuery = {
  [GroupType.EXERCISE]: number;
  [GroupType.LABORATORY]: number;
};
