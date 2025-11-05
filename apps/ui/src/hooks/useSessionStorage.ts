import { type Dispatch, type SetStateAction, useCallback, useState } from 'react';
import type { Primitive, UnknownRecord } from 'type-fest';

const readSessionStorage = <T>(key: string): T | null => {
  const item = window.sessionStorage.getItem(key);

  return item ? (JSON.parse(item) as T) : null;
};

export const useSessionStorage = <T extends Primitive | UnknownRecord>(key: string) => {
  const [value, setValue] = useState<T | null>(readSessionStorage(key));

  const setSessionStorage: Dispatch<SetStateAction<T | null>> = useCallback(
    action => {
      if (typeof action === 'function') {
        setValue(prevValue => {
          const newValue = action(prevValue);
          window.sessionStorage.setItem(key, JSON.stringify(newValue));

          return newValue;
        });
      } else {
        setValue(action);
        window.sessionStorage.setItem(key, JSON.stringify(action));
      }
    },
    [key],
  );

  return [value, setSessionStorage] as const;
};
