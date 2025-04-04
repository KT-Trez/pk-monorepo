import type { GroupApi, GroupDb } from '@pk/types/group.js';
import { AbstractDbAdapter } from './AbstractDbAdapter.ts';

export class GroupDbAdapter extends AbstractDbAdapter<GroupApi, GroupDb> {
  deleteOneQuery = `DELETE
                    FROM groups
                    WHERE group_uid = $1::UUID`;

  deleteManyQuery = `DELETE
                     FROM groups
                     WHERE group_uid = ANY ($1::UUID[]);`;

  getManyQuery = `SELECT field_of_study_id, group_uid, object_type_uid, name, year
                  FROM groups
                  LIMIT $1 OFFSET $2`;

  getOneQuery = `SELECT field_of_study_id, group_uid, object_type_uid, name, year
                 FROM groups
                 WHERE group_uid = $1`;

  name = 'GROUP';

  dbToApiObject(dbModel: GroupDb): GroupApi {
    return {
      fieldOfStudyId: dbModel.field_of_study_id,
      groupUid: dbModel.group_uid,
      name: dbModel.name,
      year: new Date(dbModel.year),
    };
  }

  getPrimaryKey(dbModel: GroupDb): string {
    return dbModel.group_uid;
  }
}
