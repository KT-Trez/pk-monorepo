import { Timetable, TimetableIcsWriter, TimetableJsonWriter, XlsTimetableParser } from '@resources';
import { GroupType } from '@types';
import process from 'process';
import {
  currentYear,
  timetableForGroupIcsPath,
  timetableForGroupJsonPath,
  timetableIcsPath,
  timetableJsonPath,
  timetableXlsPath,
} from '../../config';
import type { TimetableQueryArgs } from '../../resources/Timetable/types';
import { logger } from '../logging.service';
import { cuotRss, getLastTimetableUpdate, readTimetableLockfile, updateCuotTimetableLockfile } from '../rss.service';
import { downloadToXls, parseDownloadURLFromWeb, uploadToTorus } from '../timetable.service';
import { groupsQuery } from './constants';
import type { GroupQuery } from './types';

const getTimetable = () => {
  const timetable = new Timetable();
  const parser = new XlsTimetableParser(timetableXlsPath);

  return timetable.parse(parser);
};

export const updateResources = async () => {
  if (process.env.DEBUG) logger.log('Updating ...');

  await cuotRss.reload();

  const timetableLastUpdate = getLastTimetableUpdate();
  const timetableLockfile = readTimetableLockfile();

  if (timetableLastUpdate?.pubDate !== timetableLockfile) {
    await downloadToXls(await parseDownloadURLFromWeb());
    await updateCuotTimetableLockfile();

    const timetable = getTimetable();
    parsePerAllGroups(timetable, currentYear);
    parsePerGroup(groupsQuery, timetable, currentYear);

    if (process.env.UPLOAD) await uploadResources(groupsQuery);
  }

  if (process.env.DEBUG) logger.log('Updating finished', 'SUCCESS');
};

const parsePerAllGroups = (timetable: Timetable, year: number) => {
  if (process.env.DEBUG) logger.log('Parsing per all groups ...');

  const icsWriter = new TimetableIcsWriter({ path: timetableIcsPath });
  const jsonWriter = new TimetableJsonWriter({ path: timetableJsonPath });

  const query: TimetableQueryArgs = {
    year,
  };

  timetable.writeToFile(icsWriter, query);
  timetable.writeToFile(jsonWriter, query);
};

const parsePerGroup = (groups: GroupQuery[], timetable: Timetable, year: number) => {
  if (process.env.DEBUG) logger.log('Parsing per group ...');

  for (const group of groups) {
    const icsWriter = new TimetableIcsWriter({ path: timetableForGroupIcsPath(group[GroupType.LABORATORY]) });
    const jsonWriter = new TimetableJsonWriter({ path: timetableForGroupJsonPath(group[GroupType.LABORATORY]) });

    const query: TimetableQueryArgs = {
      exerciseGroup: group[GroupType.EXERCISE],
      laboratoryGroup: group[GroupType.LABORATORY],
      year,
    };

    timetable.writeToFile(icsWriter, query);
    timetable.writeToFile(jsonWriter, query);
  }
};

const uploadResources = async (groups: GroupQuery[]) => {
  if (process.env.DEBUG) logger.log('Uploading ...');

  const files: { path: string; remoteFilename: string }[] = [];

  for (const group of groups) {
    const path = timetableForGroupIcsPath(group[GroupType.LABORATORY]);

    files.push({ path, remoteFilename: `timetable-${group[GroupType.LABORATORY]}.ics` });
  }

  files.push({ path: timetableIcsPath, remoteFilename: 'timetable.ics' });
  files.push({ path: timetableJsonPath, remoteFilename: 'timetable.xls' });

  await uploadToTorus(files);

  if (process.env.DEBUG) logger.log('Uploading finished', 'SUCCESS');
};
