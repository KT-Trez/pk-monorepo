import fs from 'fs';
import cron from 'node-cron';
import { resourcesDir } from './config';
import { updateResources } from './services/update.service';

if (!fs.existsSync(resourcesDir)) {
  fs.mkdirSync(resourcesDir);
}

cron.schedule('0 21 * * *', updateResources, {
  timezone: 'Europe/Warsaw',
});
