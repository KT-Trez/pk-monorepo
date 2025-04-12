import { readFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { ObjectCollectorStream } from '@pk/timetable-parser-core/ObjectCollectorStream.js';
import { XlsBufferReaderStream } from '@pk/timetable-parser-core/XlsBufferReaderStream.js';
import { XlsScheduleDownloader } from '@pk/timetable-parser-core/XlsScheduleDownloader.js';
import { XlsScheduleParserStream } from '@pk/timetable-parser-core/XlsScheduleParserStream.js';
import type { ClassInfo } from '@pk/timetable-parser-core/classInfo.js';
import type { LoggerFields } from '@pk/utils/Logger/Logger.js';
import { type LoggerStrategy, type Severities, Severity } from '@pk/utils/Logger/types.js';
import { type UploadItem, uploadToServer } from './uploadToServer.service.ts';

export type UpdateTimetableArgs = {
  logger?: LoggerStrategy<Severities, LoggerFields>;
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
  await new XlsScheduleDownloader({
    downloadPath: tmpPath,
    logger,
    httpPageOrigin: timetableOrigin,
    skipWhenExists: true,
  }).load();

  logger?.log({ message: `Parsing schedule: "${tmpPath}"`, severity: Severity.Info });

  const classInfo: ClassInfo[] = [];

  await pipeline(
    new XlsBufferReaderStream({ file: readFileSync(tmpPath), range: 'A5:S500' }),
    new XlsScheduleParserStream(),
    new ObjectCollectorStream(classInfo),
  );

  logger?.log({ message: 'Schedule parsed', severity: Severity.Success });
  logger?.log({ message: `Saving schedule to: "${outputPath}"`, severity: Severity.Info });

  await writeFile(outputPath, JSON.stringify(classInfo));

  logger?.log({ message: 'Schedule saved', severity: Severity.Success });

  if (process.env.UPLOAD) {
    const files: UploadItem[] = [{ local: outputPath, remoteName: 'timetable.json' }];

    await uploadToServer({ directory: remoteDirectory, files, host: remoteOrigin, logger });
  }
};
