import { WebServer } from '../lib/WebServer.ts';
import { sessionController } from './routes/session.route.ts';

new WebServer().registerController(sessionController).listen(5000);
