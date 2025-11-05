import { router } from '../trpc.ts';
import { sessionRouter } from './v1/session.ts';
import { userRouter } from './v1/user.ts';

export const v1Router = router({
  session: sessionRouter,
  user: userRouter,
});
