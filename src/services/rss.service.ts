import { LockfileWriter } from 'components';
import {
  cuotRssOrigin,
  cuotTimeTableOrigin,
  timetableLockfilePath,
} from 'config';
import fs from 'fs';
import process from 'process';
import { Rss } from 'resources/Rss';
import Parser from 'rss-parser';
import { CuotFeed, CuotItem } from 'types';

export const cuotRss = new Rss<CuotFeed, CuotItem>(cuotRssOrigin);

export const getLastTimetableUpdate = () => {
  return cuotRss.feed?.items.find(
    (item) => item.link.trim() === cuotTimeTableOrigin,
  );
};

export const readTimetableLockfile = () => {
  if (fs.existsSync(timetableLockfilePath)) {
    return fs.readFileSync(timetableLockfilePath, { encoding: 'utf-8' });
  }
  return '';
};

export const updateCuotTimetableLockfile = async (reload?: boolean) => {
  if (process.env.DEBUG) {
    console.info('Updating cuot timetable lockfile');
  }

  if (reload) {
    await cuotRss.reload();
  }

  const dataExtractor = (feed: CuotFeed & Parser.Output<CuotItem>) =>
    feed.items.find((item) => item.link.trim() === cuotTimeTableOrigin)
      ?.pubDate ?? new Date().getTime();

  const writer = new LockfileWriter();
  cuotRss.writeLockfile(dataExtractor, timetableLockfilePath, writer);
};
