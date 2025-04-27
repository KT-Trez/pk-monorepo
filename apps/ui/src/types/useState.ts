export type Setter<T> = T | ((prev: T) => T);

export type SetterDispatch<T> = (setter: Setter<T>) => void;

export type StateSubscribe<T> = (subscription: StateSubscription<T>) => void;

export type StateSubscription<T> = (state: T) => void;

export type UseStateReturn<T> = readonly [T, SetterDispatch<T>, StateSubscribe<T>];
