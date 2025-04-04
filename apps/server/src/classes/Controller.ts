import { HttpStatuses } from '@pk/types/api.js';
import type { UnknownObject } from '@pk/types/helpers.js';
import { ActionFailure } from '../../lib/responses/ActionFailure.ts';
import { ActionSuccess } from '../../lib/responses/ActionSuccess.ts';
import type { NextFunction } from '../../lib/types.ts';
import type { WebServerRequest } from '../../lib/WebServerRequest.ts';
import type { WebServerResponse } from '../../lib/WebServerResponse.ts';
import { query } from '../database/client.ts';
import type { AbstractDbAdapter } from './adapters/AbstractDbAdapter.ts';
import { Collection } from './Collection.ts';

type ControllerArgs<ApiModel extends UnknownObject, DbModel extends UnknownObject> = {
  dbAdapter: AbstractDbAdapter<ApiModel, DbModel>;
};

export abstract class Controller<ApiModel extends UnknownObject, DbModel extends UnknownObject> {
  #dbAdapter: AbstractDbAdapter<ApiModel, DbModel>;

  protected constructor({ dbAdapter }: ControllerArgs<ApiModel, DbModel>) {
    this.#dbAdapter = dbAdapter;
  }

  async deleteOne(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const uid = req.getSearchParam('uid');

    const { rowCount } = await query(this.#dbAdapter.deleteOneQuery, [uid]);

    if (rowCount === 0) {
      return next(new ActionFailure([uid], [], HttpStatuses.notFound));
    }

    res.json(new ActionSuccess([uid]));
  }

  async deleteMany(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const uidIn = req.getSearchParam('uid_in');
    const normalizedUidIn = uidIn.split(',').map(uid => uid.trim().toLowerCase());

    const { rows, rowCount } = await query<DbModel>(this.#dbAdapter.deleteManyQuery, [normalizedUidIn]);
    const succeeded = rows.map(row => this.#dbAdapter.getPrimaryKey(row));

    if (rowCount === 0) {
      return next(new ActionFailure(normalizedUidIn, [], HttpStatuses.notFound));
    }

    if (rowCount !== normalizedUidIn.length) {
      return next(new ActionFailure(normalizedUidIn, succeeded, HttpStatuses.unprocessableEntity));
    }

    res.json(new ActionSuccess(succeeded));
  }

  async getOne(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const uid = req.getSearchParam('uid');

    const { rows } = await query<DbModel>(this.#dbAdapter.getOneQuery, [uid]);
    const item = rows.at(0);

    if (!item) {
      return next(new ActionFailure([uid], [], HttpStatuses.notFound));
    }

    res.json(this.#dbAdapter.dbToApiObject(item));
  }

  async getMany(req: WebServerRequest, res: WebServerResponse, _: NextFunction) {
    const limit = req.getOptionalSearchParam('limit');
    const normalizedLimit = limit ? Number.parseInt(limit) : 50;
    const offset = req.getOptionalSearchParam('offset');
    const normalizedOffset = offset ? Number.parseInt(offset) : 0;

    const { rows } = await query<DbModel>(this.#dbAdapter.getManyQuery, [normalizedLimit, normalizedOffset]);
    const items = rows.map(this.#dbAdapter.dbToApiObject);

    res.json(new Collection({ limit: normalizedLimit, items, offset: normalizedOffset }));
  }
}
