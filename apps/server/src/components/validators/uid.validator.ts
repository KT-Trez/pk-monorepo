import { isEmpty } from '@pk/utils/isEmpty.js';
import { isString } from '@pk/utils/isString.js';
import { isUUID } from '@pk/utils/isUUID.js';
import { not } from '@pk/utils/not';
import { RequestValidatorBuilder } from './RequestValidatorBuilder.ts';

export const uidValidator = new RequestValidatorBuilder()
    .searchParam('uid')
    .addCheck(not(isEmpty), 'must not be empty')
    .addCheck(isString, 'must be a string')
    .addCheck(isUUID, 'must be a UUID')
    .end()
    .build();
