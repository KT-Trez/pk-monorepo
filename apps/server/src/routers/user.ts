import { publicProcedure, router } from '../trpc.js';

const userRouter = router({
  greeting: publicProcedure.query(() => 'hello tRPC v10!'),
});

export type UserRouter = typeof userRouter;
