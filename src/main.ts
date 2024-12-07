import 'dotenv/config';
import { existsSync, mkdirSync } from 'node:fs';
import process from 'node:process';
import {
  cuotTimetableOrigin,
  tempDir,
  timetableOutPath,
  timetableXlsPath,
  torusOrigin,
  torusUploadDirectory,
} from '@/config';
import { logger } from '@/services/logging.service';
import { type UpdateTimetableArgs, updateTimetable } from '@/services/update.service';
import { Severity } from '@/types/severity';
import cron from 'node-cron';

if (!existsSync(tempDir)) {
  mkdirSync(tempDir);
}

logger.log(`Cron process started: v${process.env.npm_package_version}`);

const updateOptions: UpdateTimetableArgs = {
  logger,
  outputPath: timetableOutPath,
  tmpPath: timetableXlsPath,
  remoteDirectory: torusUploadDirectory,
  remoteOrigin: torusOrigin,
  timetableOrigin: cuotTimetableOrigin,
};

updateTimetable(updateOptions)
  .then(() => logger.log('Startup update finished', Severity.SUCCESS))
  .catch(error => logger.log(`Startup update failed: ${error}`, Severity.ERROR));

cron.schedule('37 21 * * *', () => updateTimetable(updateOptions), {
  timezone: 'Europe/Warsaw',
});
