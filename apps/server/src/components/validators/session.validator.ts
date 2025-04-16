import type { SessionApiPayload } from '@pk/types/session.js';
import { isEmpty } from '@pk/utils/isEmpty.js';
import { isMatching } from '@pk/utils/isMatching.js';
import { isString, isStringMatching } from '@pk/utils/isString.js';
import { not } from '@pk/utils/not';
import { EMAIL_REGEX } from '@pk/utils/regexes/email.js';
import { RequestValidatorBuilder } from './RequestValidatorBuilder.ts';

export const postSessionBodyValidator = new RequestValidatorBuilder()
    .body()
    .addCheck(not(isEmpty), 'body must be an object')
    .addCheck(
        isMatching<SessionApiPayload>({
          email: [isStringMatching(EMAIL_REGEX)],
          password: [isString, not(isEmpty)],
        }),
        'must match the "SessionApiPayload" object shape',
    )
    .end()
    .build();
