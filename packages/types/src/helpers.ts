export type ConstValues<T> = T[keyof T];

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type EmptyObject = Record<string, never>;

export type UnknownObject = Record<string, unknown>;

export type StringKey<T extends UnknownObject> = keyof T & string;
