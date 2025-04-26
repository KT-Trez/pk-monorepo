import type { ValueValidator } from '@pk/types/valueValidator.js';

export const optional = (check: (value: unknown) => boolean): ValueValidator => {
  return (value: unknown) => {
    if (value === null || value === undefined) {
      return true;
    }

    return check(value);
  };
};
