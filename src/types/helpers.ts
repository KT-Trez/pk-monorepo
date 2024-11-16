export type ConstAssertion<T> = T[keyof T];

export type Duration = { hours: number; minutes: number };

export type LabeledInfo<T> = {
  label: string;
  value: T;
};

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;
