import 'dotenv/config';
import { readFileSync } from 'node:fs';
import process from 'node:process';
import { PassThrough } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { LogLevel } from 'components/Logger';
import { XlsBufferReader } from 'components/XlsBufferReader';
import { XlsTimetableParser } from 'components/XlsTimetableParser';
import { logger } from 'services/logging.service';

if (process.env.DEBUG) {
  logger.log(`Cron process started: v${process.env.npm_package_version}`);
}

// cron.schedule('37 21 * * *', updateResources, {
//   timezone: 'Europe/Warsaw',
// });

pipeline(
  new XlsBufferReader({ file: readFileSync('./tmp/data.xls'), range: 'A5:S500' }),
  new XlsTimetableParser({ logger }),
  new PassThrough({ objectMode: true }).on('data', console.log),
).then(() => logger.log('Timetable parsed', LogLevel.SUCCESS));
