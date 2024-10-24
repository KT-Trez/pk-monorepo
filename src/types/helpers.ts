export type ConstAssertion<T> = T[keyof T];

export type Duration = { hours: number; minutes: number };

export type LabeledInfo<T> = {
  label: string;
  value: T;
};
