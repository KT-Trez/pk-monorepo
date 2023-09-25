import { NodeSSH } from 'node-ssh';
import process from 'process';
import { URL } from 'url';
import {
  CuotTimetableOriginParser,
  IcsWriter,
  StreamWriter,
} from '../components';
import { JsonWriter } from '../components/JsonWriter';
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

export const uploadToTorus = async (
  files: { localPath: string; remoteName: string }[],
) => {
  if (process.env.DEBUG) {
    console.info('Uploading to torus');
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
    console.info('Saving timetable to .ics');
  }

  // todo: make more readable
  const icsAdapter = (schoolDays: SchoolDay[]) =>
    schoolDays.map((day) => SchoolDayToIcsAdapter(day)).flat();
  const writer = new IcsWriter();
  timetable.writeToFile(icsAdapter, timetableIcsPath, writer);
};

export const writeToJson = (timetable: Timetable) => {
  if (process.env.DEBUG) {
    console.info('Saving timetable to .json');
  }

  const jsonAdapter = (lessons: SchoolDay[]) => lessons;
  const writer = new JsonWriter<SchoolDay[]>();
  timetable.writeToFile(jsonAdapter, timetableJsonPath, writer);
};
