import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { ObjectCollectorStream } from '@pk/timetable-parser-core/ObjectCollectorStream.js';
import { XlsBufferReaderStream } from '@pk/timetable-parser-core/XlsBufferReaderStream.js';
import { XlsScheduleDownloader } from '@pk/timetable-parser-core/XlsScheduleDownloader.js';
import { XlsScheduleParserStream } from '@pk/timetable-parser-core/XlsScheduleParserStream.js';
import type { ClassInfo } from '@pk/timetable-parser-core/classInfo.js';
import type { FullUserApi } from '@pk/types/user.js';
import { Severity } from '@pk/utils/Logger/types.js';
import { keyBy } from '@pk/utils/keyBy.js';
import cron from 'node-cron';
import type { PoolClient } from 'pg';
import { enrichedCalendarRepository, enrichedUserRepository, eventRepository } from '../../main.ts';
import { DatabaseService } from '../database/DatabaseService.ts';
import { logger } from '../logger/logger.ts';
import { BaseService } from '../web/BaseService.ts';
import { RegisterToDatabaseService } from '../web/RegisterToDatabaseService.ts';
import { SCHEDULE_ORIGIN, TEMP_DIR, TEMP_DOWNLOAD_PATH } from './config.ts';
import { classInfoToEventApi } from './utils/classInfoToEventApi.ts';
import { getGroupName } from './utils/getGroupName.ts';

export class ScheduleService extends BaseService {
  #classInfo: ClassInfo[] = [];

  constructor() {
    super();

    if (!existsSync(TEMP_DIR)) {
      mkdirSync(TEMP_DIR);
    }

    if (process.env.SCHEDULE_SRVICE_ON) {
      cron.schedule(
        '37 21 * * *',
        async () => {
          await this.#downloadAndParse();
          await this.#saveToDatabase();
        },
        {
          timezone: 'Europe/Warsaw',
        },
      );
    }
  }

  async asyncConstructor() {
    if (process.env.SCHEDULE_SRVICE_ON) {
      await this.#downloadAndParse();
      await this.#saveToDatabase();
    }

    return this;
  }

  async #downloadAndParse() {
    logger.log({ message: 'Downloading schedule', severity: Severity.Info });

    await new XlsScheduleDownloader({
      downloadPath: TEMP_DOWNLOAD_PATH,
      logger,
      httpPageOrigin: SCHEDULE_ORIGIN,
    }).load();

    logger.log({ message: 'Schedule downloaded', severity: Severity.Success });
    logger?.log({ message: 'Parsing schedule', severity: Severity.Info });

    this.#classInfo = [];
    await pipeline(
      new XlsBufferReaderStream({ file: readFileSync(TEMP_DOWNLOAD_PATH), range: 'A5:S500' }),
      new XlsScheduleParserStream(),
      new ObjectCollectorStream(this.#classInfo),
    );

    logger?.log({ message: 'Schedule parsed', severity: Severity.Success });
  }

  #getGroups() {
    const groups = this.#classInfo.reduce<Set<string>>((acc, { group }) => {
      const groupName = getGroupName(group);

      if (!acc.has(groupName)) {
        acc.add(groupName);
      }

      return acc;
    }, new Set());

    return Array.from(groups);
  }

  async #saveCalendarsToDatabase(serviceUser: FullUserApi, tx: PoolClient) {
    logger?.log({ message: 'Saving calendars to database', severity: Severity.Info });

    const groups = this.#getGroups();

    const calendars = await enrichedCalendarRepository.find({ name__in: groups }, { tx });
    const calendarNameByUid = keyBy(calendars, 'name', calendar => calendar.uid);

    const promises = groups.map(group => {
      const calendarUid = calendarNameByUid[group];

      if (calendarUid) {
        return eventRepository.delete({ calendarUid });
      }

      logger.log({ message: `Calendar "${group}" not found, creating new one`, severity: Severity.Debug });

      return enrichedCalendarRepository.create({ authorUid: serviceUser.uid, isPublic: true, name: group });
    });

    await Promise.all(promises);

    logger?.log({ message: 'Calendars saved to database', severity: Severity.Success });
  }

  async #saveEventsToDatabase(serviceUser: FullUserApi, tx: PoolClient) {
    logger?.log({ message: 'Saving events to database', severity: Severity.Info });

    const groups = this.#getGroups();

    const calendars = await enrichedCalendarRepository.find({ name__in: groups }, { tx });
    const calendarNameByUid = keyBy(calendars, 'name', calendar => calendar.uid);

    const events = this.#classInfo.map(classInfo => classInfoToEventApi(classInfo, calendarNameByUid, serviceUser));
    await Promise.all(events.map(event => eventRepository.create(event, tx)));

    logger?.log({ message: 'Events saved to database', severity: Severity.Success });
  }

  async #saveToDatabase() {
    const tx = await DatabaseService.instance.getTxClient();

    try {
      await tx.query('BEGIN');

      const serviceUser = await enrichedUserRepository.findOne({ email: RegisterToDatabaseService.serviceUser.email });

      if (!serviceUser) {
        throw new Error(`Service user (${RegisterToDatabaseService.serviceUser.email}) not found`);
      }

      await this.#saveCalendarsToDatabase(serviceUser, tx);
      await this.#saveEventsToDatabase(serviceUser, tx);

      await tx.query('COMMIT');

      logger?.log({ message: 'Schedule saved to database', severity: Severity.Success });
    } catch (err) {
      logger?.log({ message: `Failed to save schedule to database: ${err}`, severity: Severity.Error });
      await tx.query('ROLLBACK');
    } finally {
      tx.release();
    }
  }
}
