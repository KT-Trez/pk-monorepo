import { Router } from '../../lib/Router.ts';
import { groupController } from '../controllers/group.controller.ts';

export const groupRouter = new Router();

groupRouter.delete('/one', groupController.deleteOne.bind(groupController));

groupRouter.delete('/many', groupController.deleteMany.bind(groupController));

groupRouter.get('/many', groupController.getMany.bind(groupController));

groupRouter.get('/one', groupController.getOne.bind(groupController));
