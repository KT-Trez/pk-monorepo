import { Readable } from 'node:stream';
import type { PartialExcept } from '@/types/helpers';
import type { RowData } from '@/types/xls';
import XLSX, { type WorkBook, type WorkSheet } from 'xlsx';

type XlsBufferReaderOptions = {
  file: Buffer;
  range: string;
  skipRows: number;
};

export class XlsBufferReader extends Readable {
  readonly #sheet: WorkSheet;
  readonly #workbook: WorkBook;
  readonly #rows: RowData;

  #rowIndex: number;

  constructor({ file, range, skipRows }: PartialExcept<XlsBufferReaderOptions, 'file'>) {
    super({ objectMode: true });
    this.#rowIndex = skipRows || 0;
    this.#workbook = XLSX.read(file, { cellDates: true, type: 'buffer', UTC: false });
    const firstSheet = this.#workbook.SheetNames[0];

    if (!firstSheet) {
      throw new Error('No sheets found');
    }

    this.#sheet = this.#workbook.Sheets[firstSheet] as WorkSheet;
    this.#rows = XLSX.utils.sheet_to_json<Record<string, number | string>>(this.#sheet, {
      /* defval: null, */
      header: 'A',
      range,
    });
  }

  _read() {
    if (this.#rowIndex < this.#rows.length) {
      const chunk = this.#rows[this.#rowIndex++];

      // todo: implement backpressure
      this.push(chunk);
    } else {
      this.push(null);
    }
  }
}
