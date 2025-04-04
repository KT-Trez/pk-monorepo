import type { GroupApi, GroupDb } from '@pk/types/group.js';
import { GroupDbAdapter } from '../classes/adapters/GroupDbAdapter.ts';
import { Controller } from '../classes/Controller.ts';

class GroupController extends Controller<GroupApi, GroupDb> {
  constructor() {
    super({ dbAdapter: new GroupDbAdapter() });
  }
}

export const groupController = new GroupController();
