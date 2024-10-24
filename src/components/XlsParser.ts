import { Readable } from 'node:stream';
import XLSX, { type WorkBook, type WorkSheet } from 'xlsx';

type XlsParserOptions = {
  file: Buffer;
  skipRows?: number;
};

export class XlsParser extends Readable {
  #sheet: WorkSheet;
  #skipRows: number;
  #workbook: WorkBook;

  constructor({ file, skipRows }: XlsParserOptions) {
    super();
    this.#skipRows = skipRows || 0;
    this.#workbook = XLSX.read(file, { type: 'buffer', UTC: false });
    const firstSheet = this.#workbook.SheetNames[0];

    if (!firstSheet) {
      throw new Error('No sheets found');
    }

    this.#sheet = this.#workbook.Sheets[firstSheet] as WorkSheet;
  }
}
