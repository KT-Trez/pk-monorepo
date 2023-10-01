import { XlsParserConfig } from './types';

export const secondYearConfig: XlsParserConfig = {
  classes: [10, 11, 12, 13],
  dateIndex: 0,
  hourIndex: 1,
  hourRegex: /\d?\d:\d\d-\d?\d:\d\d/i,
  yearIndex: 9,
  yearRegex: /rok\s/i,
};
