import type { UnknownObject } from '@pk/types/helpers.js';

export abstract class AbstractObjectTransformer<ApiModel extends UnknownObject, DbModel extends UnknownObject> {
  abstract toApiObject(dbModel: DbModel): ApiModel;

  abstract toDbObject(apiModel: Partial<ApiModel>): Partial<DbModel>;

  removeUndefined<T extends UnknownObject>(obj: T): Partial<T> {
    const newObj: Partial<T> = {};

    for (const key in obj) {
      if (obj[key] !== undefined) {
        newObj[key] = obj[key];
      }
    }

    return newObj;
  }
}
