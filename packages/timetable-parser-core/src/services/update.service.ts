import { createWriteStream, existsSync, readFileSync, rmSync } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { JsonArrayWriter } from '@/components/JsonArrayWriter';
import { XlsBufferReader } from '@/components/XlsBufferReader';
import { XlsTimetableParser } from '@/components/XlsTimetableParser';
import { Severity } from '@/types/severity';
import type { LogStrategy } from '@/types/strategies';
import { type UploadItem, uploadToServer } from '@/utils/uploadToServer';

export type UpdateTimetableArgs = {
  logger: LogStrategy;
  outputPath: string;
  remoteDirectory: string;
  remoteOrigin: string;
  timetableOrigin: string;
  tmpPath: string;
};

export const updateTimetable = async ({
  logger,
  outputPath,
  remoteDirectory,
  remoteOrigin,
  timetableOrigin,
  tmpPath,
}: UpdateTimetableArgs) => {
  logger.log('Cleaning up', Severity.INFO);

  if (existsSync(tmpPath)) {
    rmSync(tmpPath);
  }

  logger.log('Downloading timetable page', Severity.INFO);

  // @ts-expect-error fetch is not defined in types definition
  const res = await fetch(timetableOrigin);
  const timetablePage = await res.text();

  const links = timetablePage.match(/https:\/\/.+\/uploads\/.+niestacjonarne.+\.xls/gi);
  const timetableUrl = links?.[0];

  if (!timetableUrl) {
    return logger.log('Timetable URL not found', Severity.ERROR);
  }

  logger.log('Downloading XLS timetable', Severity.INFO);

  // @ts-expect-error fetch is not defined in types definition
  const stream = await fetch(timetableUrl.toString());
  await pipeline(Readable.fromWeb(stream.body), createWriteStream(tmpPath));

  logger.log('Parsing timetable', Severity.INFO);

  await pipeline(
    new XlsBufferReader({ file: readFileSync(tmpPath), range: 'A5:S500' }),
    new XlsTimetableParser({ logger }),
    new JsonArrayWriter(),
    createWriteStream(outputPath, { encoding: 'utf8' }),
  );

  logger.log('Timetable parsed and saved to .json', Severity.SUCCESS);

  if (process.env.UPLOAD) {
    const files: UploadItem[] = [{ local: outputPath, remoteName: 'timetable.json' }];

    await uploadToServer({ directory: remoteDirectory, files, host: remoteOrigin, logger });
  }
};
