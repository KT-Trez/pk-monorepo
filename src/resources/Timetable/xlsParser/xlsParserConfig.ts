import { XlsParserConfig } from './types';

export const secondYearConfig: XlsParserConfig = {
  dateIndex: 0,
  // todo: fix an order
  groups: new Map([
    ['exercises', ['GĆ1', 'GĆ2']],
    ['lecture', ['GW1']],
    ['laboratories', ['GL1', 'GL2', 'GL3', 'GL4']],
  ]),
  hourIndex: 1,
  hourRegex: /\d?\d:\d\d-\d?\d:\d\d/i,
  lessons: [9, 10, 11, 12],
  yearIndex: 9,
  yearRegex: /rok\s/i,
};
