import fs from 'fs';
import { Readable } from 'stream';
import { URL } from 'url';
import { cuotPageOrigin, scheduleFilePath, scheduleUrl } from '../config';

export const downloadSchedule = async (scheduleURL: URL) => {
  if (fs.existsSync(scheduleFilePath)) {
    fs.rmSync(scheduleFilePath);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const schedule = await fetch(scheduleURL.toString());

  Readable.fromWeb(schedule.body).pipe(fs.createWriteStream(scheduleFilePath));
};

export const getScheduleDownloadURL = async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const cuotSchedulePage: string = await (await fetch(scheduleUrl)).text();

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

  return new URL(downloadPath, cuotPageOrigin);
};
