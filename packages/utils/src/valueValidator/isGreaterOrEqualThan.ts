import type { ValueValidator } from '@pk/types/valueValidator.js';

export const isGreaterOrEqualThan = (min: number): ValueValidator => {
  return (value: unknown) => {
    if (typeof value === 'string') {
      return Number.parseFloat(value) >= min;
    }

    if (typeof value === 'number') {
      return value >= min;
    }

    return false;
  };
};
