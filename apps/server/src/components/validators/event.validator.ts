import type { EventApiCreatePayload, EventApiUpdatePayload } from '@pk/types/event.js';
import { isEmpty } from '@pk/utils/valueValidator/isEmpty.js';
import { isMatching } from '@pk/utils/valueValidator/isMatching.js';
import { isNull } from '@pk/utils/valueValidator/isNull.js';
import { isOneOf } from '@pk/utils/valueValidator/isOneOf.js';
import { isString } from '@pk/utils/valueValidator/isString.js';
import { isUUID } from '@pk/utils/valueValidator/isUUID.js';
import { not } from '@pk/utils/valueValidator/not.js';
import { optional } from '@pk/utils/valueValidator/optional.js';
import { RequestValidatorBuilder } from './RequestValidatorBuilder.ts';

export const postEventValidator = new RequestValidatorBuilder()
  .body()
  .addCheck(not(isEmpty), 'body must be an object')
  .addCheck(
    isMatching<EventApiCreatePayload>({
      calendarUid: [isUUID],
      description: [optional(isString())],
      endDate: [isString()],
      location: [optional(isString())],
      startDate: [isString()],
      title: [isString()],
    }),
    'must match the "EventApiCreatePayload" object shape',
  )
  .end()
  .build();

export const putEventValidator = new RequestValidatorBuilder()
  .body()
  .addCheck(not(isEmpty), 'body must be an object')
  .addCheck(
    isMatching<EventApiUpdatePayload>({
      calendarUid: [optional(isUUID)],
      description: [optional(isOneOf([isString(), isNull]))],
      endDate: [optional(isString())],
      location: [optional(isOneOf([isString(), isNull]))],
      startDate: [optional(isString())],
      title: [optional(isString())],
      uid: [isUUID],
    }),
    'must match the "EventApiUpdatePayload" object shape',
  )
  .end()
  .build();
