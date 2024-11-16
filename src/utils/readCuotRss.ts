import type { URL } from 'node:url';
import Parser from 'rss-parser';
import type { PartialBy } from 'types/helpers';
import type { CuotFeed, CuotItem } from 'types/rss';
import { Severity } from 'types/severity';
import type { LogStrategy } from 'types/strategies';

type ReadCuotRssArgs = {
  itemOrigin: string;
  logger: LogStrategy;
  url: URL;
};

export const readCuotRss = async ({ itemOrigin, logger, url }: PartialBy<ReadCuotRssArgs, 'logger'>) => {
  logger?.log('Loading RSS', Severity.INFO);

  const parser = new Parser<CuotFeed, CuotItem>();
  const feed = await parser.parseURL(url.toString());

  logger?.log('RSS parsed', Severity.INFO);

  return feed.items.find(item => item.link.trim() === itemOrigin);
};
