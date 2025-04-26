import type { ValueValidator } from '@pk/types/valueValidator.js';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const isUUID: ValueValidator = (value: unknown) => {
  if (typeof value !== 'string') {
    return false;
  }

  return uuidRegex.test(value);
};
