import type { GroupApi, GroupDb } from '@pk/types/group.js';
import { AbstractDbAdapter } from './AbstractDbAdapter.ts';

export class GroupDbAdapter extends AbstractDbAdapter<GroupApi, GroupDb> {
  fromDatabase(dbModel: GroupDb): GroupApi {
    return {
      fieldOfStudyId: dbModel.field_of_study_id,
      groupUid: dbModel.group_uid,
      name: dbModel.name,
      year: new Date(dbModel.year),
    };
  }

  toDatabase(apiModel: GroupApi): GroupDb {
    return {
      // biome-ignore lint/style/useNamingConvention: this is a database field
      field_of_study_id: apiModel.fieldOfStudyId,
      // biome-ignore lint/style/useNamingConvention: this is a database field
      group_uid: apiModel.groupUid,
      // biome-ignore lint/style/useNamingConvention: this is a database field
      object_type_uid: 'group',
      name: apiModel.name,
      year: apiModel.year.toISOString(),
    };
  }
}
