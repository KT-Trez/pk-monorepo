import type { ValueValidator } from '@pk/types/valueValidator.js';

export const isArrayOf = (of: string[]): ValueValidator => {
  return (value: unknown): boolean => {
    if (!Array.isArray(value)) {
      return false;
    }

    for (const item of value) {
      if (!of.includes(item)) {
        return false;
      }
    }

    return true;
  };
};
