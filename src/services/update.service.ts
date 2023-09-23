import process from 'process';
import {
  cuotRss,
  getLastTimetableUpdate,
  readTimetableLockfile,
  updateCuotTimetableLockfile,
} from './rss.service';
import {
  downloadSchedule,
  getScheduleDownloadURL,
  parseXlsSchedule,
  writeToIcs,
} from './schedule.service';

export const updateResources = async () => {
  if (process.env.DEBUG) {
    console.info('Updating resources');
  }

  await cuotRss.reload();

  const timetableLastUpdate = getLastTimetableUpdate();
  const timetableLockfile = readTimetableLockfile();

  if (timetableLastUpdate?.pubDate !== timetableLockfile) {
    await updateCuotTimetableLockfile();

    const scheduleDownloadURL = await getScheduleDownloadURL();
    await downloadSchedule(scheduleDownloadURL); // todo: wait till download stream finishes
    parseXlsSchedule();
    writeToIcs();
  }
};
