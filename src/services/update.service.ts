import process from 'process';
import { timetableIcsPath, timetableJsonPath } from '../config';
import { xlsParserConfig } from '../resources/Timetable';
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
    console.info('Updating resources');
  }

  await cuotRss.reload();

  const timetableLastUpdate = getLastTimetableUpdate();
  const timetableLockfile = readTimetableLockfile();

  if (timetableLastUpdate?.pubDate !== timetableLockfile) {
    await downloadToXls(await parseDownloadURLFromWeb());
    await updateCuotTimetableLockfile();

    const timetable = parseFromXls(xlsParserConfig);
    writeToIcs(timetable);
    writeToJson(timetable);

    if (process.env.UPLOAD)
      await uploadToTorus([
        { name: 'timetable.ics', path: timetableIcsPath },
        { name: 'timetable.json', path: timetableJsonPath },
      ]);
  }

  if (process.env.DEBUG) {
    console.info('All done');
  }
};
