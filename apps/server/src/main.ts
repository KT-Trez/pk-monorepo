import { WebServer } from './components/web/WebServer.ts';
import { EnrichedCalendarRepository } from './repositories/EnrichedCalendarRepository.ts';
import { EnrichedSessionRepository } from './repositories/EnrichedSessionRepository.ts';
import { EnrichedUserRepository } from './repositories/EnrichedUserRepository.ts';
import { EventRepository } from './repositories/EventRepository.ts';
import { FullUserRepository } from './repositories/FullUserRepository.ts';
import { calendarController } from './routes/calendar.route.ts';
import { eventController } from './routes/event.route.ts';
import { optionsController } from './routes/options.route.ts';
import { sessionController } from './routes/session.route.ts';
import { userController } from './routes/user.route.ts';

export const enrichedCalendarRepository = new EnrichedCalendarRepository();
export const enrichedUserRepository = new EnrichedUserRepository();
export const enrichedSessionRepository = new EnrichedSessionRepository();
export const eventRepository = new EventRepository();
export const fullUserRepository = new FullUserRepository();

new WebServer()
  .registerAuthenticatedController(calendarController)
  .registerAuthenticatedController(eventController)
  .registerAuthenticatedController(optionsController)
  .registerAuthenticatedController(userController)
  .registerController(sessionController)
  .listen(5000);
