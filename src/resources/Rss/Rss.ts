import console from 'console';
import process from 'process';
import Parser from 'rss-parser';
import { WriterInterface } from 'types/interfaces';

export class Rss<Feed, Item> {
  get feed(): (Feed & Parser.Output<Item>) | undefined {
    return this._feed;
  }

  private _feed?: Feed & Parser.Output<Item>;
  private readonly origin: string;

  constructor(origin: string) {
    this.origin = origin;
  }

  async reload() {
    if (process.env.DEBUG) {
      console.info(`Reloading rss: ${this.origin}`);
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
