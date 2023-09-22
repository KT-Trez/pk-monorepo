import xlsx from 'node-xlsx';
import { Sheet } from '../types/sheet';

export type IXlsParser = {
  parse<T>(onlyFirstSheet?: false): Sheet<T>[];
  parse<T>(onlyFirstSheet?: true): Sheet<T>;
  parse<T>(onlyFirstSheet?: boolean): Sheet<T> | Sheet<T>[];
};

export class XlsParser implements IXlsParser {
  private readonly file: string;

  constructor(file: string) {
    this.file = file;
  }

  parse<T>(onlyFirstSheet?: false): Sheet<T>[];
  parse<T>(onlyFirstSheet?: true): Sheet<T>;
  parse<T>(onlyFirstSheet?: boolean): Sheet<T> | Sheet<T>[] {
    const sheets = xlsx.parse(this.file, {
      cellDates: true,
    });
    if (!sheets) {
      throw Error('Sheet does not exist');
    }

    const parsed: Sheet<T>[] = [];

    for (const sheet of sheets) {
      const { data, name } = sheet;
      parsed.push({
        data: (data as T[][]).filter((datum) => !!datum),
        name,
      });

      if (onlyFirstSheet) {
        return parsed[0]!;
      }
    }

    return parsed;
  }
}
