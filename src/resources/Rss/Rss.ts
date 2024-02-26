import process from 'process';
import Parser from 'rss-parser';
import { logger } from '../../services/logging.service';
import { WriterInterface } from '../../types';

export class Rss<Feed, Item> {
  private readonly origin: string;

  constructor(origin: string) {
    this.origin = origin;
  }

  private _feed?: Feed & Parser.Output<Item>;

  get feed(): (Feed & Parser.Output<Item>) | undefined {
    return this._feed;
  }

  async reload() {
    if (process.env.DEBUG) {
      logger.log(`Reloading rss: ${this.origin}`);
    }

    const parser: Parser<Feed, Item> = new Parser();
    this._feed = await parser.parseURL(this.origin);
    return this;
  }

  writeLockfile<T>(
    dataExtractor: (feed: Feed & Parser.Output<Item>) => T,
    lockfilePath: string,
    writer: WriterInterface<T>,
  ) {
    if (!this._feed) {
      throw Error('Feed is empty');
    }

    writer.write(dataExtractor(this._feed), lockfilePath);
    return this;
  }
}
