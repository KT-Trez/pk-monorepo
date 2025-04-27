import { limitValidator } from '../components/validators/limit.validator.ts';
import { offsetValidator } from '../components/validators/offset.validator.ts';
import { uidValidator } from '../components/validators/uid.validator.ts';
import { postUserBodyValidator, putUserBodyValidator } from '../components/validators/user.validator.ts';
import { UserController } from '../controllers/user.controller.ts';

export const userController = new UserController()
  .delete('/v1/user', controller => [uidValidator, controller.deleteByUid])
  .get('/v1/user', controller => [uidValidator, controller.getByUid])
  .get('/v1/users', controller => [limitValidator, offsetValidator, controller.getAll])
  .post('/v1/user', controller => [postUserBodyValidator, controller.create])
  .put('/v1/user', controller => [putUserBodyValidator, controller.updateByUid]);
