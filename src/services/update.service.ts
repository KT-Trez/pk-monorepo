import process from 'process';
import { timetableIcsPath, timetableJsonPath } from '../config';
import { secondYearConfig } from '../resources';
import { logger } from './logging.service';
import {
  cuotRss,
  getLastTimetableUpdate,
  readTimetableLockfile,
  updateCuotTimetableLockfile,
} from './rss.service';
import {
  downloadToXls,
  parseDownloadURLFromWeb,
  parseFromXls,
  uploadToTorus,
  writeToIcs,
  writeToJson,
} from './timetable.service';

export const updateResources = async () => {
  if (process.env.DEBUG) {
    logger.log('Updating resources');
  }

  await cuotRss.reload();

  const timetableLastUpdate = getLastTimetableUpdate();
  const timetableLockfile = readTimetableLockfile();

  if (timetableLastUpdate?.pubDate !== timetableLockfile) {
    await downloadToXls(await parseDownloadURLFromWeb());
    await updateCuotTimetableLockfile();

    const timetable = parseFromXls(secondYearConfig);
    writeToIcs(timetable);
    writeToJson(timetable);

    if (process.env.UPLOAD)
      await uploadToTorus([
        { localPath: timetableIcsPath, remoteName: 'timetable.ics' },
        { localPath: timetableJsonPath, remoteName: 'timetable.json' },
      ]);
  }

  if (process.env.DEBUG) {
    logger.log('All done', 'SUCCESS');
  }
};
