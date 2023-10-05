import xlsx from 'node-xlsx';
import { ParserInterface, Sheet } from '../types';

export class XlsParser<T> implements ParserInterface<Sheet<T>[]> {
  parse(xlsPath: string): Sheet<T>[] {
    const sheets = xlsx.parse(xlsPath, {
      cellDates: true,
    });
    if (!sheets) {
      throw Error('Sheet does not exist');
    }

    const parsed: Sheet<T>[] = [];

    for (const sheet of sheets) {
      const { data, name } = sheet;
      parsed.push({
        data: (data as T[]).filter(datum => !!datum),
        name,
      });
    }

    return parsed;
  }
}
