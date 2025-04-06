import { HttpStatuses } from '@pk/types/api.js';
import type { UnknownObject } from '@pk/types/helpers.js';
import type { NextFunction } from '../../lib/types.ts';
import type { WebServerRequest } from '../../lib/WebServerRequest.ts';
import type { WebServerResponse } from '../../lib/WebServerResponse.ts';
import type { IORM } from '../types/orm.js';
import type { AbstractObjectTransformer } from './AbstractObjectTransformer.ts';
import { ActionFailure } from './responses/ActionFailure.ts';
import { ActionSuccess } from './responses/ActionSuccess.ts';
import { Collection } from './responses/Collection.ts';

type ControllerArgs<ApiModel extends UnknownObject, DbModel extends UnknownObject, Model extends string> = {
  model: Model;
  orm: IORM;
  transformer: AbstractObjectTransformer<ApiModel, DbModel>;
};

export abstract class Controller<ApiModel extends UnknownObject, DbModel extends UnknownObject, Model extends string> {
  #model: Model;
  #orm: IORM;
  #transformer: AbstractObjectTransformer<ApiModel, DbModel>;

  protected constructor({ transformer, model, orm }: ControllerArgs<ApiModel, DbModel, Model>) {
    this.#model = model;
    this.#orm = orm;
    this.#transformer = transformer;
  }

  async createOne(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const body = req.getBody<Partial<ApiModel>>();
    const dbObject = this.#transformer.toDbObject(body);

    const { rowCount } = await this.#orm.insert<DbModel>(this.#model, { object: dbObject });

    if (rowCount === 0) {
      return next(new ActionFailure());
    }

    res.json(new ActionSuccess());
  }

  async deleteOne(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const uid = req.getSearchParam('uid');

    const { rowCount } = await this.#orm.delete(this.#model, { where: this.#byPrimaryKey(uid) });

    if (rowCount === 0) {
      return next(new ActionFailure([uid], [], HttpStatuses.notFound));
    }

    res.json(new ActionSuccess([uid]));
  }

  async getOne(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const uid = req.getSearchParam('uid');

    const { rows } = await this.#orm.select<DbModel>(this.#model, { where: this.#byPrimaryKey(uid) });
    const item = rows.at(0);

    if (!item) {
      return next(new ActionFailure([uid], [], HttpStatuses.notFound));
    }

    res.json(this.#transformer.toApiObject(item));
  }

  async getMany(req: WebServerRequest, res: WebServerResponse, _: NextFunction) {
    const limit = req.getOptionalSearchParam('limit');
    const normalizedLimit = limit ? Number.parseInt(limit) : 50;
    const offset = req.getOptionalSearchParam('offset');
    const normalizedOffset = offset ? Number.parseInt(offset) : 0;

    const { rows } = await this.#orm.select<DbModel>(this.#model, { limit: normalizedLimit, offset: normalizedOffset });
    const items = rows.map(this.#transformer.toApiObject);

    res.json(new Collection({ limit: normalizedLimit, items, offset: normalizedOffset }));
  }

  async updateOne(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const body = req.getBody<Partial<ApiModel>>();
    const uid = req.getSearchParam('uid');
    const dbObject = this.#transformer.toDbObject(body);

    const { rowCount } = await this.#orm.update<DbModel>(this.#model, {
      object: dbObject,
      where: this.#byPrimaryKey(uid),
    });

    if (rowCount === 0) {
      return next(new ActionFailure([uid], [], HttpStatuses.notFound));
    }

    res.json(new ActionSuccess([uid]));
  }

  #byPrimaryKey(value: string) {
    return { [this.#orm.getPrimaryKey(this.#model)]: value } as Partial<DbModel>;
  }
}
