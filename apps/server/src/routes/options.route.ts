import { OptionsController } from '../controllers/options.controller.ts';

export const optionsController = new OptionsController().get('/v1/options/calendar', controller => [
  controller.getCalendarOptions,
]);
