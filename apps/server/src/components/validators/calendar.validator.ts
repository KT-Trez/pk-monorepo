import {
  CalendarShareType,
  type EnrichedCalendarCreateApiPayload,
  type EnrichedCalendarShareApiPayload,
  type EnrichedCalendarUpdateApiPayload,
} from '@pk/types/calendar.js';
import { isBoolean } from '@pk/utils/valueValidator/isBoolean.js';
import { isEmpty } from '@pk/utils/valueValidator/isEmpty.js';
import { isEqual } from '@pk/utils/valueValidator/isEqual.js';
import { isMapMatching } from '@pk/utils/valueValidator/isMapMatching.js';
import { isMatching } from '@pk/utils/valueValidator/isMatching.js';
import { isNull } from '@pk/utils/valueValidator/isNull.js';
import { isOneOf } from '@pk/utils/valueValidator/isOneOf.js';
import { isString } from '@pk/utils/valueValidator/isString.js';
import { isUUID } from '@pk/utils/valueValidator/isUUID.js';
import { not } from '@pk/utils/valueValidator/not.js';
import { optional } from '@pk/utils/valueValidator/optional.js';
import { RequestValidatorBuilder } from './RequestValidatorBuilder.ts';

const _SHARE_TYPE_REGEX = new RegExp(`^${CalendarShareType.Editor}|${CalendarShareType.Viewer}`);

export const postCalendarValidator = new RequestValidatorBuilder()
  .body()
  .addCheck(not(isEmpty), 'body must be an object')
  .addCheck(
    isMatching<EnrichedCalendarCreateApiPayload>({
      isPublic: [optional(isBoolean)],
      name: [isString()],
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
      uid: [isUUID],
    }),
    'must match the "EnrichedCalendarUpdateApiPayload" object shape',
  )
  .end()
  .build();

export const shareCalendarValidator = new RequestValidatorBuilder()
  .body()
  .addCheck(not(isEmpty), 'body must be an object')
  .addCheck(
    isMatching<EnrichedCalendarShareApiPayload>({
      sharedWith: [isMapMatching(isUUID, isOneOf([isEqual(CalendarShareType.Viewer), isNull]))],
      uid: [isUUID],
    }),
    'must match the "EnrichedCalendarShareApiPayload" object shape',
  )
  .end()
  .build();
