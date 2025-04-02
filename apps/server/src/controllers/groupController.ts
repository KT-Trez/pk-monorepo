import type { GroupApi, GroupDb } from '@pk/types/group.js';
import { GroupDbAdapter } from '../classes/adapters/GroupDbAdapter.ts';
import { Controller } from '../classes/Controller.ts';
import { client } from '../database/client.ts';

class GroupController extends Controller<GroupApi, GroupDb> {
  getManyQuery: string;
  getOneQuery: string;

  constructor() {
    super({ dbAdapter: new GroupDbAdapter(), dbClient: client });

    this.getManyQuery = 'SELECT * FROM groups LIMIT $1 OFFSET $2';
    this.getOneQuery = 'SELECT * FROM groups WHERE group_uid = $1';
  }
}

export const groupController = new GroupController();
