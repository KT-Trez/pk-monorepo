import type { EventApi } from '@pk/types/event.js';
import { isDate } from '@pk/utils/isDate.js';
import { isEmpty } from '@pk/utils/isEmpty.js';
import { isMatching } from '@pk/utils/isMatching.js';
import { isString } from '@pk/utils/isString.js';
import { not } from '@pk/utils/not';
import { optional } from '@pk/utils/optional.js';
import { Router } from '../../lib/Router.ts';
import { RequestValidatorBuilder } from '../classes/RequestValidatorBuilder.ts';
import { eventController } from '../controllers/event.controller.ts';
import { limitValidator, offsetValidator, uidValidator } from './validators.ts';

export const eventRouter = new Router();

eventRouter.delete('/one', uidValidator, eventController.deleteOne.bind(eventController));

eventRouter.get('/many', limitValidator, offsetValidator, eventController.getMany.bind(eventController));

eventRouter.get('/one', uidValidator, eventController.getOne.bind(eventController));

eventRouter.post(
  '/one',
  new RequestValidatorBuilder()
    .body()
    .addCheck(not(isEmpty), 'body must not be empty')
    .addCheck(
      isMatching<EventApi>({
        description: [optional(isString), optional(not(isEmpty))],
        endDate: [isDate],
        location: [optional(isString), optional(not(isEmpty))],
        startDate: [isDate],
        title: [isString, not(isEmpty)],
      }),
      'must match the "event" object shape',
    )
    .end()
    .build(),
  eventController.createOne.bind(eventController),
);

eventRouter.put(
  '/one',
  new RequestValidatorBuilder()
    .body()
    .addCheck(not(isEmpty), 'body must not be empty')
    .addCheck(
      isMatching<EventApi>({
        description: [optional(isString), optional(not(isEmpty))],
        endDate: [optional(isDate)],
        location: [optional(isString), optional(not(isEmpty))],
        startDate: [optional(isDate)],
        title: [optional(isString), optional(not(isEmpty))],
      }),
      'must match the "event" object shape',
    )
    .end()
    .build(),
  uidValidator,
  eventController.updateOne.bind(eventController),
);
