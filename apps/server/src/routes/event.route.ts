import { postEventValidator, putEventValidator } from '../components/validators/event.validator.ts';
import { limitValidator } from '../components/validators/limit.validator.ts';
import { offsetValidator } from '../components/validators/offset.validator.ts';
import { uidValidator } from '../components/validators/uid.validator.ts';
import { EventController } from '../controllers/event.controller.ts';

export const eventController = new EventController()
  .delete('/v1/event', controller => [uidValidator, controller.deleteByUid])
  .get('/v1/events', controller => [limitValidator, offsetValidator, controller.getAll])
  .post('/v1/event', controller => [postEventValidator, controller.create])
  .put('/v1/event', controller => [putEventValidator, controller.updateByUid]);
