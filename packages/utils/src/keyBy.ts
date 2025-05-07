import type { UnknownObject } from '@pk/types/helpers.js';

export const keyBy = <
  T extends UnknownObject,
  K extends { [P in keyof T]: T[P] extends string ? P : never }[keyof T],
  U = T,
>(
  items: T[],
  key: K,
  by?: (item: T) => U,
) => {
  const callback = by ?? ((item: T) => item as unknown as U);

  return items.reduce<Record<string, U>>((acc, item) => {
    if (item) {
      acc[item[key] as string] = callback(item);
    }

    return acc;
  }, {});
};
