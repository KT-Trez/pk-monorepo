import type { UnknownObject } from '@pk/types/helpers.js';

export abstract class AbstractDbAdapter<ApiModel extends UnknownObject, DbModel extends UnknownObject> {
  abstract fromDatabase(dbModel: DbModel): ApiModel;

  abstract toDatabase(apiModel: ApiModel): DbModel;
}
