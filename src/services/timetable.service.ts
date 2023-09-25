import { CuotTimetableOriginParser, IcsWriter, StreamWriter } from 'components';
import { cuotOrigin, cuotTimeTableOrigin, timetableXlsPath } from 'config';
import process from 'process';
import { URL } from 'url';
import {
  SchoolDayToIcsAdapter,
  Timetable,
  XlsTimetableParser,
} from '../resources/Timetable';
import { SchoolDay } from '../resources/Timetable/SchoolDay';
import { XlsParserConfig } from '../resources/Timetable/xlsParser/types';

export const downloadToXls = async (timetableURL: URL) => {
  if (process.env.DEBUG) {
    console.info('Downloading XLS timetable');
  }

  await new StreamWriter().write(timetableURL, timetableXlsPath);
};

export const parseDownloadURLFromWeb = async () => {
  const downloads = await new CuotTimetableOriginParser().parse(
    cuotTimeTableOrigin,
  );

  const isComputerScienceTimetable = (path: string) =>
    /informatyka/i.test(path) && /niestacjonarn[ea]/i.test(path);

  const timetablePath = downloads.find(isComputerScienceTimetable);

  if (!timetablePath) {
    throw Error('Timetable not found');
  }

  return new URL(timetablePath, cuotOrigin);
};

export const parseFromXls = (parserConfig: XlsParserConfig) => {
  const parser = new XlsTimetableParser(parserConfig);
  return new Timetable().parse(parser);
};

export const writeToIcs = (timetable: Timetable) => {
  if (process.env.DEBUG) {
    console.info('Saving timetable to .ics');
  }

  // todo: make more readable
  const icsAdapter = (schoolDays: SchoolDay[]) =>
    schoolDays.map((day) => SchoolDayToIcsAdapter(day)).flat();
  const writer = new IcsWriter();
  timetable.writeToFile(icsAdapter, writer);
};
