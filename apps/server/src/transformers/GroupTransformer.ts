import type { GroupApi, GroupDb } from '@pk/types/group.js';
import { ObjectType } from '@pk/types/objectType.js';
import { AbstractObjectTransformer } from '../classes/AbstractObjectTransformer.ts';

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
      field_of_study_id: apiModel.fieldOfStudyId,
      name: apiModel.name,
      object_type_id: ObjectType.group,
    });
  }
}
