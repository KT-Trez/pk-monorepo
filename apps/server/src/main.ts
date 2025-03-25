import { WebServer } from '../lib/WebServer.ts';
import { userRouter } from './routers/userRouter.ts';

const app = new WebServer();

app.use('/user', userRouter);

app.listen(5000);
