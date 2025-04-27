import { type EnrichedUserApiCreatePayload, type EnrichedUserApiUpdatePayload, UserRole } from '@pk/types/user.js';
import { EMAIL_REGEX } from '@pk/utils/regexes/email.js';
import { isArrayOf } from '@pk/utils/valueValidator/isArrayOf.js';
import { isEmpty } from '@pk/utils/valueValidator/isEmpty.js';
import { isMatching } from '@pk/utils/valueValidator/isMatching.js';
import { isString, isStringMatching } from '@pk/utils/valueValidator/isString.js';
import { isUUID } from '@pk/utils/valueValidator/isUUID.js';
import { not } from '@pk/utils/valueValidator/not.js';
import { optional } from '@pk/utils/valueValidator/optional.js';
import { RequestValidatorBuilder } from './RequestValidatorBuilder.ts';

export const postUserBodyValidator = new RequestValidatorBuilder()
  .body()
  .addCheck(not(isEmpty), 'body must be an object')
  .addCheck(
    isMatching<EnrichedUserApiCreatePayload>({
      email: [isStringMatching(EMAIL_REGEX)],
      name: [isString()],
      password: [isString()],
      roles: [isArrayOf([UserRole.Admin, UserRole.Member])],
      surname: [isString()],
    }),
    'must match the "EnrichedUserApiCreatePayload" object shape',
  )
  .end()
  .build();

export const putUserBodyValidator = new RequestValidatorBuilder()
  .body()
  .addCheck(not(isEmpty), 'body must be an object')
  .addCheck(
    isMatching<EnrichedUserApiUpdatePayload>({
      email: [optional(isStringMatching(EMAIL_REGEX))],
      name: [optional(isString())],
      password: [isString()],
      roles: [optional(isArrayOf([UserRole.Admin, UserRole.Member]))],
      surname: [optional(isString())],
      uid: [isUUID],
    }),
    'must match the "EnrichedUserApiUpdatePayload" object shape',
  )
  .end()
  .build();
