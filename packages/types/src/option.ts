export type Option<T extends Record<string, unknown> = Record<string, unknown>> = {
  name: string;
  uid: string;
} & T;
