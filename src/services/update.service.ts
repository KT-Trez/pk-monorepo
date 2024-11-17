import fs, { createWriteStream, readFileSync } from 'node:fs';
import { Readable, Transform, type TransformCallback } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { XlsBufferReader } from '@/components/XlsBufferReader';
import { XlsTimetableParser } from '@/components/XlsTimetableParser';
import { cuotTimetableOrigin } from '@/config';
import type { Day } from '@/models/Day';
import { Severity } from '@/types/severity';
import type { LogStrategy } from '@/types/strategies';
import BufferEncoding = NodeJS.BufferEncoding;

type UpdateTimetableArgs = {
  logger: LogStrategy;
  outputPath: string;
  tmpPath: string;
};

export const updateTimetable = async ({ logger, outputPath, tmpPath }: UpdateTimetableArgs) => {
  logger.log('Cleaning up', Severity.INFO);

  if (fs.existsSync(tmpPath)) {
    fs.rmSync(tmpPath);
  }

  logger.log('Downloading timetable page', Severity.INFO);

  // @ts-expect-error fetch is not defined in types definition
  const res = await fetch(cuotTimetableOrigin);
  const timetablePage = await res.text();

  const links = timetablePage.match(/https:\/\/.+\/uploads\/.+niestacjonarne.+\.xls/gi);
  const timetableUrl = links?.[0];

  if (!timetableUrl) {
    return logger.log('Timetable URL not found', Severity.ERROR);
  }

  logger.log('Downloading XLS timetable', Severity.INFO);

  // @ts-expect-error fetch is not defined in types definition
  const stream = await fetch(timetableUrl.toString());
  await pipeline(Readable.fromWeb(stream.body), fs.createWriteStream(tmpPath));

  logger.log('Parsing timetable', Severity.INFO);

  await pipeline(
    new XlsBufferReader({ file: readFileSync(tmpPath), range: 'A5:S500' }),
    new XlsTimetableParser({ logger }),
    new Transform({
      construct(callback: (error?: Error | null) => void) {
        // @ts-expect-error isFirst is not defined in types definition
        this.isFirst = true;
        this.push('[');
        callback();
      },
      final(callback: (error?: Error | null) => void) {
        this.push(']');
        callback();
      },
      objectMode: true,
      transform(chunk: Day, _: BufferEncoding, callback: TransformCallback) {
        let canPushMoreData = true;

        // @ts-expect-error isFirst is not defined in types definition
        if (this.isFirst) {
          // @ts-expect-error isFirst is not defined in types definition
          this.isFirst = false;
        } else {
          canPushMoreData = this.push(',');
        }

        if (canPushMoreData && this.push(JSON.stringify(chunk))) {
          callback();
        } else {
          this.once('drain', callback);
        }
      },
    }),
    createWriteStream(outputPath),
  );

  logger.log('Timetable updated', Severity.SUCCESS);

  // const timetable = parseFromXls(secondYearConfig);
  // writeToIcs(timetable);
  // writeToJson(timetable);
  //
  // if (process.env.UPLOAD)
  //   await uploadToTorus([
  //     { localPath: timetableIcsPath, remoteName: 'timetable.ics' },
  //     { localPath: timetableJsonPath, remoteName: 'timetable.json' },
  //   ]);
};
