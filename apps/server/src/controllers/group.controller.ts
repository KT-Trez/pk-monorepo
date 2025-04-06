import type { GroupApi, GroupDb } from '@pk/types/group.js';
import { GroupTransformer } from '../classes/adapters/GroupTransformer.ts';
import { Controller } from '../classes/Controller.ts';
import { orm } from '../database/orm.ts';

class GroupController extends Controller<GroupApi, GroupDb, 'groups'> {
  constructor() {
    super({ model: 'groups', orm, transformer: new GroupTransformer() });
  }
}

export const groupController = new GroupController();
