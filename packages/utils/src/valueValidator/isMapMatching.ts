import type { ValueValidator } from '@pk/types/valueValidator.js';

export const isMapMatching = (keyValidator: ValueValidator, valueValidator: ValueValidator): ValueValidator => {
  return (map: unknown) => {
    if (typeof map !== 'object' || map === null || Array.isArray(map)) {
      return false;
    }

    for (const key in map) {
      const value = (map as Record<string, unknown>)[key];

      if (!(keyValidator(key) && valueValidator(value))) {
        return false;
      }
    }

    return true;
  };
};
