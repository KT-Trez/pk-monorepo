import { isCuotScheduleValid, updateRssUpdateLockfile } from './rss.service';
import { downloadSchedule, getScheduleDownloadURL } from './schedule.service';

export const updateResources = async () => {
  const [isValid, lastScheduleUpdate] = await isCuotScheduleValid();
  if (!isValid && lastScheduleUpdate) {
    await updateRssUpdateLockfile(lastScheduleUpdate.pubDate);
  }

  if (!isValid) {
    const scheduleDownloadURL = await getScheduleDownloadURL();
    await downloadSchedule(scheduleDownloadURL);
  }
};
