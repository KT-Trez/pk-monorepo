import { SessionController } from '../controllers/session.controller.ts';

export const sessionController = new SessionController()
    .delete('/v1/session', controller => [controller.deleteByUid])
    .post('/v1/session', controller => [controller.create]);
