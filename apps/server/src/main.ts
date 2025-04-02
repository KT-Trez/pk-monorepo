import { WebServer } from '../lib/WebServer.ts';
import { groupRouter } from './routers/groupRouter.ts';
import { userRouter } from './routers/userRouter.ts';

const app = new WebServer();

app.use('/group', groupRouter);
app.use('/user', userRouter);

app.listen(5000);
