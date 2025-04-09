export type Collection<T, M extends Record<string, unknown> = Record<string, never>> = {
  has_more: boolean;
  limit: number;
  meta: M;
  objects: T[];
  page: number;
};
