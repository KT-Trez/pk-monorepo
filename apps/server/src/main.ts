import { WebServer } from './components/web/WebServer.ts';
import { sessionController } from './routes/session.route.ts';
import { userController } from './routes/user.route.ts';

new WebServer().registerController(userController).registerController(sessionController).listen(5000);
