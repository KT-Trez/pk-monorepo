import 'reflect-metadata';
import { Severity } from '@pk/utils/Logger/types.js';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { runSeeders } from 'typeorm-extension';
import { logger } from './components/logger/logger.ts';
import { createContext } from './context.ts';
import { AppDataSource } from './dataSource.ts';
import { EnrichedCalendarRepository } from './repositories/EnrichedCalendarRepository.ts';
import { EnrichedSessionRepository } from './repositories/EnrichedSessionRepository.ts';
import { EnrichedUserRepository } from './repositories/EnrichedUserRepository.ts';
import { EventRepository } from './repositories/EventRepository.ts';
import { FullUserRepository } from './repositories/FullUserRepository.ts';
import { appRouter } from './routers/app.ts';

// todo: remove this
export const enrichedCalendarRepository = new EnrichedCalendarRepository();
export const enrichedUserRepository = new EnrichedUserRepository();
export const enrichedSessionRepository = new EnrichedSessionRepository();
export const eventRepository = new EventRepository();
export const fullUserRepository = new FullUserRepository();

// todo: remove this
// await new WebServer()
// .registerAuthenticatedController(calendarController)
// .registerAuthenticatedController(eventController)
// .registerAuthenticatedController(optionsController)
// .registerAuthenticatedController(userController)
// .registerController(rootController)
// .registerController(sessionController)
// .registerService(new DatabaseService())
// .registerService(new RegisterToDatabaseService())
// .registerService(new ScheduleService())
// .listen(5000);

const TRPC_PORT = process.env.PORT || 5000;

AppDataSource.initialize()
  .then(() => {
    const db = process.env.POSTGRES_DB;
    const host = process.env.POSTGRES_HOST;

    logger.log({ message: `Connected to database (address="${host}:5432", db="${db}")`, severity: Severity.Success });
  })
  .then(async () => {
    await runSeeders(AppDataSource);

    const server = createHTTPServer({
      createContext,
      router: appRouter,
    });
    server.listen({ port: TRPC_PORT });

    logger.log({ message: `Started tRPC server (port=${TRPC_PORT})`, severity: Severity.Success });
  })
  .catch(error => logger.log({ message: `Connection failed: ${error}`, severity: Severity.Error }));
