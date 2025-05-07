export type NewState<T> = T | ((prev: T) => T);

export type SetState<T> = (setter: NewState<T>) => void;

export type StateSubscription<T> = (state: T) => void;

export type SubscribeState<T> = (subscription: StateSubscription<T>) => void;

export type UseStateReturn<T> = readonly [SetState<T>, SubscribeState<T>];
