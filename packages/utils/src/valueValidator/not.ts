import type { ValueValidator } from '@pk/types/valueValidator.js';

export const not = (check: (value: unknown) => boolean): ValueValidator => {
  return (value: unknown) => {
    return !check(value);
  };
};
