import type { LoggerFields } from '@pk/utils/Logger/Logger.js';
import { type LoggerStrategy, type Severities, Severity } from '@pk/utils/Logger/types.js';
import { createWriteStream, existsSync, rmSync } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

type XlsScheduleDownloaderOptions = {
  downloadPath: string;
  httpPageOrigin: string;
  logger?: LoggerStrategy<Severities, LoggerFields>;
  skipWhenExists?: boolean;
};

export class XlsScheduleDownloader {
  readonly #downloadPath: string;
  readonly #logger?: LoggerStrategy<Severities, LoggerFields>;
  readonly #schedulePageOrigin: string;
  readonly #skipWhenExists: boolean = false;

  constructor({ downloadPath, httpPageOrigin, logger, skipWhenExists }: XlsScheduleDownloaderOptions) {
    this.#downloadPath = downloadPath;
    this.#logger = logger;
    this.#schedulePageOrigin = httpPageOrigin;

    if (skipWhenExists) {
      this.#skipWhenExists = skipWhenExists;
    }
  }

  async load(): Promise<void> {
    if (this.#skipWhenExists && existsSync(this.#downloadPath)) {
      return this.#logger?.log({
        message: `Schedule already exists at path: "${this.#downloadPath}, skipping saving ..."`,
        severity: Severity.Warn,
      });
    }

    this.#logger?.log({
      message: `Cleaning up download path: "${this.#downloadPath}"`,
      severity: Severity.Info,
    });

    try {
      if (existsSync(this.#downloadPath)) {
        rmSync(this.#downloadPath);
      }

      this.#logger?.log({ message: 'Download path cleaned up', severity: Severity.Success });
      this.#logger?.log({
        message: `Downloading page with redirect to schedule: "${this.#schedulePageOrigin}"`,
        severity: Severity.Info,
      });

      const res = await fetch(this.#schedulePageOrigin);
      const timetablePage = await res.text();

      this.#logger?.log({ message: 'Page with redirect to schedule downloaded', severity: Severity.Success });
      this.#logger?.log({ message: 'Parsing page with redirect to schedule', severity: Severity.Info });

      const links = timetablePage.match(/https:\/\/.+\/uploads\/.+niestacjonarne.+\.xls/gi);
      const timetableUrl = links?.[0];

      if (!timetableUrl) {
        return this.#logger?.log({ message: '', severity: Severity.Error });
      }

      this.#logger?.log({ message: `Parsed schedule redirect: "${timetableUrl}"`, severity: Severity.Success });
      this.#logger?.log({ message: 'Fetching schedule', severity: Severity.Info });

      const stream = await fetch(timetableUrl);

      if (!stream.body) {
        return this.#logger?.log({ message: 'Schedule stream was empty', severity: Severity.Error });
      }

      this.#logger?.log({ message: `Downloading schedule: "${this.#downloadPath}"`, severity: Severity.Info });

      await pipeline(Readable.fromWeb(stream.body), createWriteStream(this.#downloadPath));

      this.#logger?.log({ message: 'Schedule downloaded', severity: Severity.Success });
    } catch (err) {
      this.#logger?.log({ message: `HttpScheduleLoader failed with error: ${err}`, severity: Severity.Error });
    }
  }
}
