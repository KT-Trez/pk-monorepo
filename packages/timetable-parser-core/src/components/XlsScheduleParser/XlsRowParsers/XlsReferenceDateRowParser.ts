import type { XlsRowData } from '../../../types/xls.ts';
import type { XlsRowParserStrategy } from '../xlsRowParserStrategy.ts';

export class XlsReferenceDateRowParser implements XlsRowParserStrategy<Date> {
  static readonly #dateColumn = 'A';
  static #referenceDate = new Date(Number.POSITIVE_INFINITY);

  parse(row: XlsRowData): Date {
    const date = row[XlsReferenceDateRowParser.#dateColumn];

    if (date instanceof Date) {
      XlsReferenceDateRowParser.#referenceDate = date;
    }

    return XlsReferenceDateRowParser.#referenceDate;
  }
}
