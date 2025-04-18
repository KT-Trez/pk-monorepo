import { WebServer } from '../lib/WebServer.ts';
import { eventRouter } from './routers/event.router.ts';
import { groupRouter } from './routers/group.router.ts';
import { userRouter } from './routers/user.router.ts';

const app = new WebServer();

app.use('/event', eventRouter);
app.use('/group', groupRouter);
app.use('/user', userRouter);

app.listen(5000);
