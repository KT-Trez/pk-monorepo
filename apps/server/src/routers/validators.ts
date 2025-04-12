import { isEmpty } from '@pk/utils/isEmpty.js';
import { isGreaterOrEqualThan } from '@pk/utils/isGreaterOrEqualThan.js';
import { isLessOrEqualThan } from '@pk/utils/isLessOrEqualThan.js';
import { isNumber } from '@pk/utils/isNumber.js';
import { isString } from '@pk/utils/isString.js';
import { isUUID } from '@pk/utils/isUUID.js';
import { not } from '@pk/utils/not';
import { optional } from '@pk/utils/optional.js';
import { RequestValidatorBuilder } from '../classes/RequestValidatorBuilder.ts';

export const limitValidator = new RequestValidatorBuilder()
  .searchParam('limit')
  .addCheck(optional(isNumber), 'must be a number')
  .addCheck(optional(isGreaterOrEqualThan(0)), 'must be greater or equal to 0')
  .addCheck(optional(isLessOrEqualThan(10_000)), 'must be less or equal to 10 000')
  .end()
  .build();

export const offsetValidator = new RequestValidatorBuilder()
  .searchParam('offset')
  .addCheck(optional(isNumber), 'must be a number')
  .addCheck(optional(isGreaterOrEqualThan(0)), 'must be greater than 0')
  .end()
  .build();

export const uidValidator = new RequestValidatorBuilder()
  .searchParam('uid')
  .addCheck(not(isEmpty), 'must not be empty')
  .addCheck(isString, 'must be a string')
  .addCheck(isUUID, 'must be a UUID')
  .end()
  .build();
