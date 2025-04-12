import type { XlsRowData } from '../../types/xls.ts';

export type XlsRowParserStrategy<T> = {
  parse(row: XlsRowData): T;
};
