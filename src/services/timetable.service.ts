import { CuotTimetableOriginParser, IcsWriter, StreamWriter } from 'components';
import { cuotOrigin, timetableXlsPath } from 'config';
import process from 'process';
import {
  LessonToIcsAdapter,
  Timetable,
  xlsTimetable,
  XlsTimetableParser,
} from 'resources/Timetable';
import { URL } from 'url';
import { Lesson } from '../types';

export const downloadToXls = async (timetableURL: URL) => {
  if (process.env.DEBUG) {
    console.info('Downloading XLS timetable');
  }

  await new StreamWriter().write(timetableURL, timetableXlsPath);
};

export const parseDownloadURLFromWeb = async () => {
  const downloads = await new CuotTimetableOriginParser().parse(cuotOrigin);

  const isComputerScienceTimetable = (path: string) =>
    /informatyka/i.test(path) && /niestacjonarn[ea]/i.test(path);

  const timetablePath = downloads.find(isComputerScienceTimetable);

  if (!timetablePath) {
    throw Error('Timetable not found');
  }

  return new URL(timetablePath, cuotOrigin);
};

export const parseFromXls = (config: xlsTimetable) => {
  const parser = new XlsTimetableParser(config, timetableXlsPath);
  return new Timetable().parse(parser);
};

export const writeToIcs = (timetable: Timetable) => {
  if (process.env.DEBUG) {
    console.info('Saving timetable to .ics');
  }

  const icsAdapter = (lessons: Lesson[]) =>
    lessons.map((lesson) => new LessonToIcsAdapter(lesson));
  const writer = new IcsWriter();
  timetable.writeToFile(icsAdapter, writer);
};
