import type { UnknownObject } from '@pk/types/helpers.js';

export abstract class AbstractDbAdapter<ApiModel extends UnknownObject, DbModel extends UnknownObject> {
  abstract deleteOneQuery: string;
  abstract deleteManyQuery: string;
  abstract getOneQuery: string;
  abstract getManyQuery: string;

  abstract name: string;

  abstract dbToApiObject(dbModel: DbModel): ApiModel;

  abstract getPrimaryKey(dbModel: DbModel): string;
}
