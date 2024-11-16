import 'dotenv/config';
import process from 'node:process';
import { timetableOutPath, timetableXlsPath } from '@/config';
import { logger } from '@/services/logging.service';
import { updateTimetable } from '@/services/update.service';
import cron from 'node-cron';

logger.log(`Cron process started: v${process.env.npm_package_version}`);

cron.schedule(
  '37 21 * * *',
  () => updateTimetable({ logger, outputPath: timetableOutPath, tmpPath: timetableXlsPath }),
  {
    timezone: 'Europe/Warsaw',
  },
);
