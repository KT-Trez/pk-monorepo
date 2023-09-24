import { xlsTimetable } from '../XlsTimetableParser';

export const xlsParserConfig: xlsTimetable = {
  dateIndex: 0,
  hourIndex: 1,
  hourRegex: /\d?\d:\d\d-\d?\d:\d\d/i,
  lessons: [
    {
      group: new Map([
        [1, 'GW1'],
        [2, 'GĆ1'],
        [4, 'GL1'],
      ]),
      index: 9,
    },
    {
      group: new Map([
        [1, 'GW1'],
        [2, 'GĆ1'],
        [4, 'GL2'],
      ]),
      index: 10,
    },
    {
      group: new Map([
        [1, 'GW1'],
        [2, 'GĆ2'],
        [4, 'GL3'],
      ]),
      index: 11,
    },
    {
      group: new Map([
        [1, 'GW1'],
        [2, 'GĆ2'],
        [4, 'GL4'],
      ]),
      index: 12,
    },
  ],
  yearIndex: 9,
  yearRegex: /\d?\d:\d\d-\d?\d:\d\d/i,
};
