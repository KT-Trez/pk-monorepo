import { existsSync, mkdirSync } from 'node:fs';
import process from 'node:process';
import { Severity } from '@pk/utils/Logger/types.js';
import cron from 'node-cron';
import {
  scheduleOutPath,
  scheduleXlsPath,
  tempDir,
  uploadServerDirectory,
  uploadServerOrigin,
  wiitScheduleOrigin,
} from './config.ts';
import { injectVersion } from './services/injectVersion.service.ts';
import { logger } from './services/logger.service.ts';
import { type UpdateTimetableArgs, updateTimetable } from './services/update.service.ts';

if (!existsSync(tempDir)) {
  mkdirSync(tempDir);
}

injectVersion();

logger.log({ message: `Cron process started: v${process.env.npm_package_version}`, severity: Severity.Info });

const updateOptions: UpdateTimetableArgs = {
  logger,
  outputPath: scheduleOutPath,
  tmpPath: scheduleXlsPath,
  remoteDirectory: uploadServerDirectory,
  remoteOrigin: uploadServerOrigin,
  timetableOrigin: wiitScheduleOrigin,
};

updateTimetable(updateOptions)
  .then(() => logger.log({ message: 'Startup update finished', severity: Severity.Success }))
  .catch(error => logger.log({ message: `Startup update failed: ${error}`, severity: Severity.Error }));

cron.schedule('37 21 * * *', () => updateTimetable(updateOptions), {
  timezone: 'Europe/Warsaw',
});
