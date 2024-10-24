export type Collection<T, M extends Record<string, unknown> = Record<string, never>> = {
  hasNext: boolean;
  items: T[];
  limit: number;
  meta: M;
  page: number;
};
