import { postCalendarValidator, putCalendarValidator } from '../components/validators/calendar.validator.ts';
import { limitValidator } from '../components/validators/limit.validator.ts';
import { offsetValidator } from '../components/validators/offset.validator.ts';
import { uidValidator } from '../components/validators/uid.validator.ts';
import { CalendarController } from '../controllers/calendar.controller.ts';

export const calendarController = new CalendarController()
  .delete('/v1/calendar', controller => [uidValidator, controller.deleteByUid])
  .get('/v1/calendars', controller => [limitValidator, offsetValidator, controller.getAll])
  .post('/v1/calendar', controller => [postCalendarValidator, controller.create])
  .put('/v1/calendar', controller => [putCalendarValidator, controller.updateByUid]);
