import 'dotenv/config';
import { updateResources } from '@services';
import fs from 'fs';
import cron from 'node-cron';
import process from 'process';
import { resourcesDir } from './config';
import { logger } from './services/logging.service';

if (process.env.DEBUG) {
  logger.log(`Cron process started: v${process.env.npm_package_version}`);
}

if (!fs.existsSync(resourcesDir)) {
  fs.mkdirSync(resourcesDir);
}

cron.schedule('37 21 * * *', updateResources, {
  timezone: 'Europe/Warsaw',
});

if (!process.env.UPDATE_ON_START) updateResources();
