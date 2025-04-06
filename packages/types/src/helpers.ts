export type ConstValues<T> = T[keyof T];

export type UnknownObject = Record<string, unknown>;

export type StringKey<T extends UnknownObject> = keyof T & string;
