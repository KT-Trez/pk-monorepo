import { isGreaterOrEqualThan } from '@pk/utils/valueValidator/isGreaterOrEqualThan.js';
import { isLessOrEqualThan } from '@pk/utils/valueValidator/isLessOrEqualThan.js';
import { isNumber } from '@pk/utils/valueValidator/isNumber.js';
import { optional } from '@pk/utils/valueValidator/optional.js';
import { RequestValidatorBuilder } from './RequestValidatorBuilder.ts';

export const limitValidator = new RequestValidatorBuilder()
  .searchParam('limit')
  .addCheck(optional(isNumber), 'must be a number')
  .addCheck(optional(isGreaterOrEqualThan(0)), 'must be greater or equal to 0')
  .addCheck(optional(isLessOrEqualThan(10_000)), 'must be less or equal to 10 000')
  .end()
  .build();
