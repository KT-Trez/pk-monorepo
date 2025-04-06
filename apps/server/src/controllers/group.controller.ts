import type { GroupApi, GroupDb } from '@pk/types/group.js';
import { BaseController } from '../classes/BaseController.ts';
import { orm } from '../database/orm.ts';
import { GroupTransformer } from '../transformers/GroupTransformer.ts';

class GroupController extends BaseController<GroupApi, GroupDb, 'groups'> {
  constructor() {
    super({ model: 'groups', orm, transformer: new GroupTransformer() });
  }
}

export const groupController = new GroupController();
