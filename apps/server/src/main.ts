import { WebServer } from './components/web/WebServer.ts';
import { EnrichedCalendarRepository } from './repositories/EnrichedCalendarRepository.ts';
import { EnrichedSessionRepository } from './repositories/EnrichedSessionRepository.ts';
import { EnrichedUserRepository } from './repositories/EnrichedUserRepository.ts';
import { FullUserRepository } from './repositories/FullUserRepository.ts';
import { calendarController } from './routes/calendar.route.ts';
import { sessionController } from './routes/session.route.ts';
import { userController } from './routes/user.route.ts';

export const enrichedCalendarRepository = new EnrichedCalendarRepository();
export const enrichedUserRepository = new EnrichedUserRepository();
export const enrichedSessionRepository = new EnrichedSessionRepository();
export const fullUserRepository = new FullUserRepository();

new WebServer()
  .registerAuthenticatedController(userController)
  .registerAuthenticatedController(calendarController)
  .registerController(sessionController)
  .listen(5000);
