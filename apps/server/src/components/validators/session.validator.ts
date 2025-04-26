import type { SessionApiCreatePayload } from '@pk/types/session.js';
import { EMAIL_REGEX } from '@pk/utils/regexes/email.js';
import { isEmpty } from '@pk/utils/valueValidator/isEmpty.js';
import { isMatching } from '@pk/utils/valueValidator/isMatching.js';
import { isString, isStringMatching } from '@pk/utils/valueValidator/isString.js';
import { not } from '@pk/utils/valueValidator/not.js';
import { RequestValidatorBuilder } from './RequestValidatorBuilder.ts';

export const postSessionBodyValidator = new RequestValidatorBuilder()
  .body()
  .addCheck(not(isEmpty), 'body must be an object')
  .addCheck(
    isMatching<SessionApiCreatePayload>({
      email: [isStringMatching(EMAIL_REGEX)],
      password: [isString(), not(isEmpty)],
    }),
    'must match the "SessionApiPayload" object shape',
  )
  .end()
  .build();
