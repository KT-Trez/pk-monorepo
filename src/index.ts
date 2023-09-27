import 'dotenv/config';
import fs from 'fs';
import cron from 'node-cron';
import process from 'process';
import { resourcesDir } from './config';
import { updateResources } from './services';

if (process.env.DEBUG) {
  console.info(`Cron process started: v${process.env.npm_package_version}`);
}

if (!fs.existsSync(resourcesDir)) {
  fs.mkdirSync(resourcesDir);
}

cron.schedule('37 21 * * *', updateResources, {
  timezone: 'Europe/Warsaw',
});
