import fs from 'fs';
import { Readable } from 'stream';
import { URL } from 'url';
import { IcsWriter } from '../components/IcsWriter';
import { cuotOrigin, cuotTimeTableOrigin, timetableXlsPath } from '../config';
import { Lesson, LessonToIcsAdapter, Schedule } from '../resources/Schedule';
import {
  ScheduleParserConfig,
  XlsScheduleParser,
} from '../resources/Schedule/XlsScheduleParser';

export const parseXlsSchedule = () => {
  const parserConfig: ScheduleParserConfig = {
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
  const parser = new XlsScheduleParser(parserConfig, timetableXlsPath);
  return new Schedule().parse(parser);
};

export const downloadSchedule = async (scheduleURL: URL) => {
  if (fs.existsSync(timetableXlsPath)) {
    fs.rmSync(timetableXlsPath);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const schedule = await fetch(scheduleURL.toString());

  // noinspection JSUnresolvedReference
  Readable.fromWeb(schedule.body).pipe(fs.createWriteStream(timetableXlsPath));
};

export const getScheduleDownloadURL = async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  const cuotSchedulePage: string = await // @ts-ignore
  (await fetch(cuotTimeTableOrigin)).text();

  const downloadPaths = cuotSchedulePage.match(/(?<=\/)download.*(?=")/gm);
  if (!downloadPaths) {
    throw Error('Download links are missing');
  }

  const downloadPath = downloadPaths.find(
    (path) => /informatyka/i.test(path) && /niestacjonarn[ea]/i.test(path),
  );
  if (!downloadPath) {
    throw Error('Schedule download path is missing');
  }

  return new URL(downloadPath, cuotOrigin);
};

export const writeToIcs = () => {
  const icsAdapter = (lessons: Lesson[]) =>
    lessons.map((lesson) => new LessonToIcsAdapter(lesson));
  const writer = new IcsWriter();
  parseXlsSchedule().writeToFile(icsAdapter, writer);
};
