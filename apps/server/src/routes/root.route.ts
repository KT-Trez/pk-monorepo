import { RootController } from '../controllers/root.controller.ts';

export const rootController = new RootController().get('/v1/health', controller => [controller.healthCheck]);
