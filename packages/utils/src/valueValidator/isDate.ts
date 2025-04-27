import type { ValueValidator } from '@pk/types/valueValidator.js';

export const isDate: ValueValidator = (value: unknown) => {
  if (typeof value === 'string') {
    return !Number.isNaN(Date.parse(value));
  }

  return value instanceof Date;
};
