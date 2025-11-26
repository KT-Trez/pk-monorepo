import { router } from '../trpc.ts';
import { calendarRouter } from './v1/calendar.ts';
import { sessionRouter } from './v1/session.ts';
import { userRouter } from './v1/user.ts';

export const v1Router = router({
  calendar: calendarRouter,
  session: sessionRouter,
  user: userRouter,
});
