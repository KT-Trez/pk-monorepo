import type { ValueValidator } from '@pk/types/valueValidator.js';

export const isString: ValueValidator = (value: unknown, canBeEmpty = false) => {
  if (typeof value !== 'string') {
    return false;
  }

  return !canBeEmpty && value !== '';
};

export const isStringMatching = (regex: RegExp, canBeEmpty = false): ValueValidator => {
  return (value: unknown) => {
    if (typeof value !== 'string') {
      return false;
    }

    if (!canBeEmpty && value.length === 0) {
      return false;
    }

    return regex.test(value);
  };
};
