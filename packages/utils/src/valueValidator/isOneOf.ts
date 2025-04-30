import type { ValueValidator } from '@pk/types/valueValidator.js';

export const isOneOf = (validators: ValueValidator[]): ValueValidator => {
  return value => {
    return validators.some(validator => validator(value));
  };
};
