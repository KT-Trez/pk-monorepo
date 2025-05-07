import type { NewState, StateSubscription, SubscribeState, UseStateReturn } from '../types/useState.ts';

export const useState = <T extends boolean | null | number | string | unknown[]>(
  initialState: T,
): UseStateReturn<T> => {
  let state: T = initialState;
  const subscriptions: StateSubscription<T>[] = [];

  const setState = (setter: NewState<T>) => {
    const isCallback = typeof setter === 'function';

    if (isCallback) {
      state = setter(state);
    } else {
      state = setter;
    }

    for (const subscriber of subscriptions) {
      subscriber(state);
    }
  };

  const subscribe: SubscribeState<T> = subscription => {
    subscriptions.push(subscription);
  };

  return [setState, subscribe] as const;
};
