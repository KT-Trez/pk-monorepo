import { isCuotScheduleValid, updateRssUpdateLockfile } from './rss.service';
import {
  downloadSchedule,
  getScheduleDownloadURL,
  parseXlsSchedule,
  writeToIcs,
} from './schedule.service';

export const updateResources = async () => {
  const [isScheduleValid, lastScheduleUpdate] = await isCuotScheduleValid();
  if (!isScheduleValid && lastScheduleUpdate) {
    await updateRssUpdateLockfile(lastScheduleUpdate.pubDate);
  }

  if (!isScheduleValid) {
    const scheduleDownloadURL = await getScheduleDownloadURL();
    await downloadSchedule(scheduleDownloadURL);
    parseXlsSchedule();
    writeToIcs();
  }
};
