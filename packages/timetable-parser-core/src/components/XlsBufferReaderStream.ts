import { Readable } from 'node:stream';
import XLSX, { type WorkBook, type WorkSheet } from 'xlsx';
import type { XlsRowData } from '../types/xls.ts';

export type XlsBufferReaderOptions = {
  file: Buffer;
  range?: string;
  skipRows?: number;
};

export class XlsBufferReaderStream extends Readable {
  readonly #sheet: WorkSheet;
  readonly #workbook: WorkBook;
  readonly #rows: XlsRowData[];

  #rowIndex: number;

  constructor({ file, range, skipRows }: XlsBufferReaderOptions) {
    super({ objectMode: true });
    this.#rowIndex = skipRows ?? 0;
    this.#workbook = XLSX.read(file, { cellDates: true, type: 'buffer', UTC: false });

    const firstSheet = this.#workbook.SheetNames[0];

    if (!firstSheet) {
      throw new Error('No sheets found');
    }

    this.#sheet = this.#workbook.Sheets[firstSheet] as WorkSheet;
    this.#rows = XLSX.utils.sheet_to_json<XlsRowData>(this.#sheet, {
      // defval: null,
      header: 'A',
      range,
    });
  }

  _read() {
    if (this.#rowIndex < this.#rows.length) {
      const chunk = this.#rows[this.#rowIndex++];

      this.push(chunk);
    } else {
      this.push(null);
    }
  }
}
