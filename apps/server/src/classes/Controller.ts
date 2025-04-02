import type { UnknownObject } from '@pk/types/helpers.js';
import type { Client } from 'pg';
import { NotFoundError } from '../../lib/errors/NotFoundError.ts';
import { ServerError } from '../../lib/errors/ServerError.ts';
import type { NextFunction } from '../../lib/types.ts';
import type { WebServerRequest } from '../../lib/WebServerRequest.ts';
import type { WebServerResponse } from '../../lib/WebServerResponse.ts';
import type { AbstractDbAdapter } from './adapters/AbstractDbAdapter.ts';
import { Collection } from './Collection.ts';

type ControllerArgs<ApiModel extends UnknownObject, DbModel extends UnknownObject> = {
  dbAdapter: AbstractDbAdapter<ApiModel, DbModel>;
  dbClient: Client;
};

export abstract class Controller<ApiModel extends UnknownObject, DbModel extends UnknownObject> {
  abstract getManyQuery: string;
  abstract getOneQuery: string;
  #dbAdapter: AbstractDbAdapter<ApiModel, DbModel>;
  #dbClient: Client;

  protected constructor({ dbAdapter, dbClient }: ControllerArgs<ApiModel, DbModel>) {
    this.#dbAdapter = dbAdapter;
    this.#dbClient = dbClient;
  }

  async getOne(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const uidParam = req.parsedURL.searchParams.get('uid');

    try {
      const { rows } = await this.#dbClient.query<DbModel>(this.getOneQuery, [uidParam]);
      const oneObject = rows.at(0);

      if (!oneObject) {
        return next(new NotFoundError(`Object (${uidParam})`));
      }

      res.json(this.#dbAdapter.fromDatabase(oneObject));
    } catch (err) {
      next(new ServerError({ cause: err }));
    }
  }

  async getMany(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    try {
      const limitParam = req.parsedURL.searchParams.get('limit');
      const offsetParam = req.parsedURL.searchParams.get('offset');

      const limit = limitParam ? Number.parseInt(limitParam) : 50;
      const offset = offsetParam ? Number.parseInt(offsetParam) : 0;

      const { rows } = await this.#dbClient.query<DbModel>(this.getManyQuery, [limit, offset]);

      const items = rows.map(row => this.#dbAdapter.fromDatabase(row));

      res.json(new Collection({ limit, items, offset }));
    } catch (err) {
      next(new ServerError({ cause: err }));
    }
  }
}
