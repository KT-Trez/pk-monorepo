export type GroupConfig = Map<
  'lecture' | 'exercises' | 'laboratories' | 'language',
  string[]
>;

export type XlsFormat = [
  Date,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

export type XlsParserConfig = {
  dateIndex: number;
  groups: GroupConfig;
  hourIndex: number;
  hourRegex: RegExp;
  lessons: number[];
  yearIndex: number;
  yearRegex: RegExp;
};
