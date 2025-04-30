import type { ValueValidator } from '@pk/types/valueValidator.js';

export const isNull: ValueValidator = (value: unknown) => {
  return value === null;
};
