export type ConstValues<T> = T[keyof T];

export type EmptyObject = Record<string, never>;

export type UnknownObject = Record<string, unknown>;
