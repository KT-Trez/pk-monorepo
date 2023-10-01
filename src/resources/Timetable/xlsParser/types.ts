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
  classes: number[];
  dateIndex: number;
  hourIndex: number;
  hourRegex: RegExp;
  yearIndex: number;
  yearRegex: RegExp;
};
