import {
  CalendarShareType,
  type EnrichedCalendarCreateApiPayload,
  type EnrichedCalendarUpdateApiPayload,
} from '@pk/types/calendar.js';
import { isBoolean } from '@pk/utils/valueValidator/isBoolean.js';
import { isEmpty } from '@pk/utils/valueValidator/isEmpty.js';
import { isMapMatching } from '@pk/utils/valueValidator/isMapMatching.js';
import { isMatching } from '@pk/utils/valueValidator/isMatching.js';
import { isString, isStringMatching } from '@pk/utils/valueValidator/isString.js';
import { isUUID } from '@pk/utils/valueValidator/isUUID.js';
import { not } from '@pk/utils/valueValidator/not.js';
import { optional } from '@pk/utils/valueValidator/optional.js';
import { RequestValidatorBuilder } from './RequestValidatorBuilder.ts';

const SHARE_TYPE_REGEX = new RegExp(`^${CalendarShareType.Editor}|${CalendarShareType.Viewer}`);

export const postCalendarValidator = new RequestValidatorBuilder()
  .body()
  .addCheck(not(isEmpty), 'body must be an object')
  .addCheck(
    isMatching<EnrichedCalendarCreateApiPayload>({
      isPublic: [optional(isBoolean)],
      name: [isString()],
      sharedWith: [optional(isMapMatching(isUUID, isStringMatching(SHARE_TYPE_REGEX)))],
    }),
    'must match the "EnrichedCalendarCreateApiPayload" object shape',
  )
  .end()
  .build();

export const putCalendarValidator = new RequestValidatorBuilder()
  .body()
  .addCheck(not(isEmpty), 'body must be an object')
  .addCheck(
    isMatching<EnrichedCalendarUpdateApiPayload>({
      isPublic: [optional(isBoolean)],
      name: [optional(isString())],
      sharedWith: [optional(isMapMatching(isUUID, isStringMatching(SHARE_TYPE_REGEX)))],
      uid: [isUUID],
    }),
    'must match the "EnrichedCalendarUpdateApiPayload" object shape',
  )
  .end()
  .build();
