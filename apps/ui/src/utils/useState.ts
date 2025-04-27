import type { Setter, StateSubscribe, StateSubscription, UseStateReturn } from '../types/useState.ts';

export const useState = <T extends boolean | null | number | string | unknown[]>(
  initialState: T,
): UseStateReturn<T> => {
  let state: T = initialState;
  const subscribers: StateSubscription<T>[] = [];

  const setState = (setter: Setter<T>) => {
    const isCallback = typeof setter === 'function';

    if (isCallback) {
      state = setter(state);
    } else {
      state = setter;
    }

    for (const subscriber of subscribers) {
      subscriber(state);
    }
  };

  const subscribe: StateSubscribe<T> = subscriber => {
    subscribers.push(subscriber);
  };

  return [state, setState, subscribe] as const;
};
