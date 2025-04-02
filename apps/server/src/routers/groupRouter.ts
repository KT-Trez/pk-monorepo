import { Router } from '../../lib/Router.ts';
import { groupController } from '../controllers/groupController.ts';

export const groupRouter = new Router();

groupRouter.get('/many', groupController.getMany.bind(groupController));

groupRouter.get('/one', groupController.getOne.bind(groupController));
