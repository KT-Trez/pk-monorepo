import { router } from '../trpc.ts';
import { v1Router } from './v1.ts';

export const appRouter = router({
  v1: v1Router,
});

export type AppRouter = typeof appRouter;
