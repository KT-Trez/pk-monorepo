import type { ValueValidator } from '@pk/types/valueValidator.js';

export const isEqual = <T>(expectedValue: T): ValueValidator => {
  return value => {
    return value === expectedValue;
  };
};
