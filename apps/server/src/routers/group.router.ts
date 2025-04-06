import type { GroupApi } from '@pk/types/group.js';
import { isEmpty } from '@pk/utils/isEmpty.js';
import { isMatching } from '@pk/utils/isMatching.js';
import { isNumber } from '@pk/utils/isNumber.js';
import { isString } from '@pk/utils/isString.js';
import { not } from '@pk/utils/not';
import { optional } from '@pk/utils/optional.js';
import { Router } from '../../lib/Router.ts';
import { RequestValidatorBuilder } from '../classes/RequestValidatorBuilder.ts';
import { groupController } from '../controllers/group.controller.ts';
import { limitValidator, offsetValidator, uidValidator } from './validators.ts';

export const groupRouter = new Router();

groupRouter.delete('/one', uidValidator, groupController.deleteOne.bind(groupController));

groupRouter.get('/many', limitValidator, offsetValidator, groupController.getMany.bind(groupController));

groupRouter.get('/one', uidValidator, groupController.getOne.bind(groupController));

groupRouter.post(
    '/one',
    new RequestValidatorBuilder()
        .body()
        .addCheck(
            isMatching<GroupApi>({
              fieldOfStudyId: [isNumber],
              name: [isString, not(isEmpty)],
              type: [isNumber],
            }),
            'must match the "group" object shape',
        )
        .end()
        .build(),
    groupController.createOne.bind(groupController),
);

groupRouter.put(
    '/one',
    uidValidator,
    new RequestValidatorBuilder()
        .body()
        .addCheck(
            isMatching<GroupApi>({
              fieldOfStudyId: [optional(isNumber)],
              name: [optional(isString), optional(not(isEmpty))],
              type: [optional(isNumber)],
            }),
            'must match the "group" object shape',
        )
        .end()
        .build(),
    groupController.updateOne.bind(groupController),
);
