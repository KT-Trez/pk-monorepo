import type { ValueValidator } from '@pk/types/valueValidator.js';

export const isString: ValueValidator = (value: unknown) => {
  return typeof value === 'string';
};
