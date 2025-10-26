import 'reflect-metadata';
import { DatabaseService } from './components/database/DatabaseService.ts';
import { ScheduleService } from './components/schedule/ScheduleService.ts';
import { RegisterToDatabaseService } from './components/web/RegisterToDatabaseService.ts';
import { WebServer } from './components/web/WebServer.ts';
import { AppDataSource } from './data-source.js';
import { User } from './entity/User.js';
import { EnrichedCalendarRepository } from './repositories/EnrichedCalendarRepository.ts';
import { EnrichedSessionRepository } from './repositories/EnrichedSessionRepository.ts';
import { EnrichedUserRepository } from './repositories/EnrichedUserRepository.ts';
import { EventRepository } from './repositories/EventRepository.ts';
import { FullUserRepository } from './repositories/FullUserRepository.ts';
import { calendarController } from './routes/calendar.route.ts';
import { eventController } from './routes/event.route.ts';
import { optionsController } from './routes/options.route.ts';
import { rootController } from './routes/root.route.ts';
import { sessionController } from './routes/session.route.ts';
import { userController } from './routes/user.route.ts';

// todo: remove this
export const enrichedCalendarRepository = new EnrichedCalendarRepository();
export const enrichedUserRepository = new EnrichedUserRepository();
export const enrichedSessionRepository = new EnrichedSessionRepository();
export const eventRepository = new EventRepository();
export const fullUserRepository = new FullUserRepository();

// todo: remove this
await new WebServer()
  .registerAuthenticatedController(calendarController)
  .registerAuthenticatedController(eventController)
  .registerAuthenticatedController(optionsController)
  .registerAuthenticatedController(userController)
  .registerController(rootController)
  .registerController(sessionController)
  .registerService(new DatabaseService())
  .registerService(new RegisterToDatabaseService())
  .registerService(new ScheduleService())
  .listen(5000);

AppDataSource.initialize()
  .then(async () => {
    console.log('Inserting a new user into the database...');
    const user = new User();
    user.name = 'Timber Saw';
    user.surname = 'Sam';

    await AppDataSource.manager.save(user);
    console.log(`Saved a new user with id: ${user.uid}`);

    console.log('Loading users from the database...');
    const users = await AppDataSource.manager.find(User);
    console.log('Loaded users: ', users);

    console.log('Here you can setup and run express / fastify / any other framework.');
  })
  .catch(error => console.log(error));
