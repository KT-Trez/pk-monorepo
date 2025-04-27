import { postSessionBodyValidator } from '../components/validators/session.validator.ts';
import { uidValidator } from '../components/validators/uid.validator.ts';
import { SessionController } from '../controllers/session.controller.ts';

export const sessionController = new SessionController()
  .delete('/v1/session', controller => [uidValidator, controller.deleteByUid])
  .post('/v1/session', controller => [postSessionBodyValidator, controller.create]);
