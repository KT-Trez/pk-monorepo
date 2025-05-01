import { OptionsController } from '../controllers/optionsController.ts';

export const optionsController = new OptionsController().get('/v1/options/calendar', controller => [
  controller.getCalendarOptions,
]);
