import { router } from '../trpc.ts';
import { userRouter } from './v1/user.ts';

export const v1Router = router({
  user: userRouter,
});
