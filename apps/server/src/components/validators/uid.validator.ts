import { isString } from '@pk/utils/valueValidator/isString.js';
import { isUUID } from '@pk/utils/valueValidator/isUUID.js';
import { RequestValidatorBuilder } from './RequestValidatorBuilder.ts';

export const uidValidator = new RequestValidatorBuilder()
    .searchParam('uid')
    .addCheck(isString(), 'must be a non-empty string')
    .addCheck(isUUID, 'must be a UUID')
    .end()
    .build();
