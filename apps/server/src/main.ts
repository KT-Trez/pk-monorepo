import { WebServer } from './components/web/WebServer.ts';
import { EnrichedUserRepository } from './repositories/EnrichedUserRepository.ts';
import { FullUserRepository } from './repositories/FullUserRepository.ts';
import { sessionController } from './routes/session.route.ts';
import { userController } from './routes/user.route.ts';

export const enrichedUserRepository = new EnrichedUserRepository();
export const fullUserRepository = new FullUserRepository();

new WebServer().registerController(userController).registerController(sessionController).listen(5000);
