import type { ValueValidator } from '@pk/types/valueValidator.js';

export const isLessOrEqualThan = (max: number): ValueValidator => {
  return (value: unknown) => {
    if (typeof value === 'string') {
      return Number.parseFloat(value) <= max;
    }

    if (typeof value === 'number') {
      return value <= max;
    }

    return false;
  };
};
