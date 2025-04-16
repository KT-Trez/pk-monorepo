import type { UserPayloadApi } from '@pk/types/user.js';
import { isEmpty } from '@pk/utils/isEmpty.js';
import { isMatching } from '@pk/utils/isMatching.js';
import { isNumber } from '@pk/utils/isNumber.js';
import { isString, isStringMatching } from '@pk/utils/isString.js';
import { isUUID } from '@pk/utils/isUUID.js';
import { not } from '@pk/utils/not';
import { optional } from '@pk/utils/optional.js';
import { EMAIL_REGEX } from '@pk/utils/regexes/email.js';
import { RequestValidatorBuilder } from './RequestValidatorBuilder.ts';

const FIRST_NAME_AND_LAST_NAME_REGEX = /^[a-z]+\s[a-z]+$/i;

export const postUserBodyValidator = new RequestValidatorBuilder()
    .body()
    .addCheck(not(isEmpty), 'body must be an object')
    .addCheck(
        isMatching<UserPayloadApi>({
          album: [isNumber],
          email: [isStringMatching(EMAIL_REGEX)],
          name: [isStringMatching(FIRST_NAME_AND_LAST_NAME_REGEX)],
          password: [isString],
        }),
        'must match the "Partial<UserPayloadApi>" object shape',
    )
    .end()
    .build();

export const putUserBodyValidator = new RequestValidatorBuilder()
    .body()
    .addCheck(not(isEmpty), 'body must be an object')
    .addCheck(
        isMatching<Partial<UserPayloadApi>>({
          album: [optional(isNumber)],
          email: [optional(isStringMatching(EMAIL_REGEX))],
          name: [optional(isStringMatching(FIRST_NAME_AND_LAST_NAME_REGEX))],
          password: [optional(isString)],
          uid: [isUUID],
        }),
        'must match the "Partial<UserPayloadApi>" object shape',
    )
    .end()
    .build();
