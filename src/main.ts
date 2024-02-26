import 'dotenv/config';
import { updateResources } from '@services';
import fs from 'fs';
import cron from 'node-cron';
import process from 'process';
import { resourcesDir } from './config';

if (process.env.DEBUG) {
  console.info('Starting cron');
}

if (!fs.existsSync(resourcesDir)) {
  fs.mkdirSync(resourcesDir);
}

cron.schedule('37 21 * * *', updateResources, {
  timezone: 'Europe/Warsaw',
});
