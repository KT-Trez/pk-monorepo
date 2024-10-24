import 'dotenv/config';
import process from 'node:process';
import { logger } from 'services/logging.service';

if (process.env.DEBUG) {
  logger.log(`Cron process started: v${process.env.npm_package_version}`);
}

// cron.schedule('37 21 * * *', updateResources, {
//   timezone: 'Europe/Warsaw',
// });
