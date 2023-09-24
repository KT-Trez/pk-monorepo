import process from 'process';
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
  writeToIcs,
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
  }
};
