import { NodeSSH } from 'node-ssh';
import process from 'process';
import { URL } from 'url';
import {
  CuotTimetableOriginParser,
  IcsWriter,
  JsonWriter,
  StreamWriter,
} from '../components';
import {
  cuotOrigin,
  cuotTimeTableOrigin,
  timetableIcsPath,
  timetableJsonPath,
  timetableXlsPath,
  torusOrigin,
  torusUploadPath,
} from '../config';
import {
  Timetable,
  UniDay,
  UniDayToIcsEventAdapter,
  XlsParserConfig,
  XlsTimetableParser,
} from '../resources';
import { TimetableEndpoint } from '../types';
import { logger } from './logging.service';
import { readTimetableLockfile } from './rss.service';

export const downloadToXls = async (timetableURL: URL) => {
  if (process.env.DEBUG) {
    logger.log('Downloading XLS timetable');
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

export const uploadToTorus = async (
  files: { localPath: string; remoteName: string }[],
) => {
  if (process.env.DEBUG) {
    logger.log('Uploading to torus');
  }

  const ssh = new NodeSSH();
  await ssh.connect({
    host: torusOrigin,
    username: process.env.TORUS_USERNAME,
    password: process.env.TORUS_PASSWORD,
  });

  await ssh.putFiles(
    files.map(({ remoteName, localPath }) => ({
      local: localPath,
      remote: `${torusUploadPath}/${remoteName}`,
    })),
  );
};

export const writeToIcs = (timetable: Timetable) => {
  if (process.env.DEBUG) {
    logger.log('Saving timetable to .ics');
  }

  // todo: make more readable
  const icsAdapter = (schoolDays: UniDay[]) =>
    schoolDays.map(day => UniDayToIcsEventAdapter(day)).flat();
  const writer = new IcsWriter();
  timetable.writeToFile(icsAdapter, timetableIcsPath, writer);
};

export const writeToJson = (timetable: Timetable) => {
  if (process.env.DEBUG) {
    logger.log('Saving timetable to .json');
  }

  const pubDate = new Date(Date.parse(readTimetableLockfile()));

  const jsonAdapter = (classes: UniDay[]): TimetableEndpoint => ({
    pubDate,
    timetable: classes,
  });
  const writer = new JsonWriter<TimetableEndpoint>();
  timetable.writeToFile(jsonAdapter, timetableJsonPath, writer);
};
