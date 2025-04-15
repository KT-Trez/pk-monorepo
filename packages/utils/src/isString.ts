import type { ValueValidator } from '@pk/types/valueValidator.js';

export const isString: ValueValidator = (value: unknown) => {
  return typeof value === 'string';
};

export const isStringMatching = (regex: RegExp): ValueValidator => {
  return (value: unknown) => {
    if (typeof value !== 'string') {
      return false;
    }

    return regex.test(value);
  };
};
