import { isGreaterOrEqualThan } from '@pk/utils/valueValidator/isGreaterOrEqualThan.js';
import { isNumber } from '@pk/utils/valueValidator/isNumber.js';
import { optional } from '@pk/utils/valueValidator/optional.js';
import { RequestValidatorBuilder } from './RequestValidatorBuilder.ts';

export const offsetValidator = new RequestValidatorBuilder()
  .searchParam('offset')
  .addCheck(optional(isNumber), 'must be a number')
  .addCheck(optional(isGreaterOrEqualThan(0)), 'must be greater than 0')
  .end()
  .build();
