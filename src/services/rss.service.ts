import fs from 'fs';
import Parser from 'rss-parser';
import { rssUpdateLockfilePath, scheduleUrl } from '../config';
import { RssFeed, RssItem } from '../types/rss';

const normalizeText = (text: string) => text.replace(/[^a-z]/gi, '');

export const isCuotScheduleValid = async (): Promise<
  [boolean, RssItem | undefined]
> => {
  const rssItems = await readCuotOrigin();
  const lastScheduleUpdate = rssItems.find((item) =>
    new RegExp(normalizeText(scheduleUrl), 'i').test(normalizeText(item.link)),
  );

  if (!fs.existsSync(rssUpdateLockfilePath)) {
    return [false, lastScheduleUpdate];
  }

  const rssLastUpdate = fs.readFileSync(rssUpdateLockfilePath, {
    encoding: 'utf-8',
  });

  return [lastScheduleUpdate?.pubDate === rssLastUpdate, lastScheduleUpdate];
};

const readCuotOrigin = async (): Promise<RssItem[]> => {
  const parser: Parser<RssFeed, RssItem> = new Parser();
  const feed = await parser.parseURL('https://it.pk.edu.pl/rss/');
  return feed.items;
};

export const updateRssUpdateLockfile = async (lastUpdate: string) => {
  if (fs.existsSync(rssUpdateLockfilePath)) {
    fs.rmSync(rssUpdateLockfilePath);
  }

  fs.writeFileSync(rssUpdateLockfilePath, lastUpdate, {
    encoding: 'utf-8',
  });
};
