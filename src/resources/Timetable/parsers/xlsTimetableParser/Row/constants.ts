import type { RowConfig } from './types';

export const defaultRowConfig: RowConfig = {
  dateIndex: 0,
  hourIndex: 1,
  hourRegExp: /\d?\d\.\d\d-\d?\d\.\d\d/i,
};
