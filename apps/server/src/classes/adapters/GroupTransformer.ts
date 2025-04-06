import type { GroupApi, GroupDb } from '@pk/types/group.js';
import { AbstractObjectTransformer } from './AbstractObjectTransformer.ts';

export class GroupTransformer extends AbstractObjectTransformer<GroupApi, GroupDb> {
  toApiObject(dbModel: GroupDb): GroupApi {
    return {
      fieldOfStudyId: dbModel.field_of_study_id,
      name: dbModel.name,
      type: dbModel.object_type_id,
      uid: dbModel.group_uid,
      yearOfCreation: dbModel.year,
    };
  }

  toDbObject(apiModel: Partial<GroupApi>): Partial<GroupDb> {
    return this.removeUndefined({
      // biome-ignore lint/style/useNamingConvention: this is a database field
      field_of_study_id: apiModel.fieldOfStudyId,
      name: apiModel.name,
      // biome-ignore lint/style/useNamingConvention: this is a database field
      object_type_id: apiModel.type,
    });
  }
}
