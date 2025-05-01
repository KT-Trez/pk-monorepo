import type { UnknownObject } from '@pk/types/helpers.js';
import type { ValueValidator } from '@pk/types/valueValidator.js';

export const isMatching = <T extends UnknownObject>(
  obj: Partial<Record<keyof T, ValueValidator[]>>,
): ValueValidator => {
  return (value: unknown) => {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    for (const key in value) {
      const conditions = obj[key];
      if (!conditions) {
        return false;
      }

      // @ts-ignore: cannot index a generic 'object' type
      const property = value[key];

      const isValid = conditions?.every(condition => condition(property));

      if (!isValid) {
        return false;
      }
    }

    return true;
  };
};
