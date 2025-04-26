import type { ValueValidator } from '@pk/types/valueValidator.js';

export const isNumber: ValueValidator = (value: unknown) => {
  if (typeof value === 'string') {
    return Number.isFinite(Number.parseFloat(value));
  }

  return typeof value === 'number';
};
