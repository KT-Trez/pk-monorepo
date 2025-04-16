import { ObjectType } from '@pk/types/objectType.js';
import type { UserApi, UserDb, UserPayloadApi } from '@pk/types/user.js';
import { ObjectNotFound } from '../components/response/ObjectNotFound.ts';
import { ServerError } from '../components/response/ServerError.ts';
import { ServerSuccess } from '../components/response/ServerSuccess.ts';
import { BaseController } from '../components/web/BaseController.v3.ts';
import { Hash } from '../components/web/Hash.ts';
import type { WebServerRequest } from '../components/web/WebServerRequest.ts';
import type { WebServerResponse } from '../components/web/WebServerResponse.ts';
import { create, deleteUserByUid, selectUserByUid, updateUser } from '../queries/user.ts';
import type { NextFunction } from '../types/http.js';

export class UserController extends BaseController {
  static #toApiObject(userDb: UserDb): UserApi {
    return {
      album: userDb.album,
      email: userDb.email,
      name: `${userDb.first_name} ${userDb.last_name}`,
      uid: userDb.user_uid,
    };
  }

  static #toDbObject(userApi: Partial<UserPayloadApi>): Partial<UserDb> {
    const [first_name, last_name] = userApi.name?.split(' ') ?? [];

    return UserController.removeUndefined({
      album: userApi.album,
      email: userApi.email,
      first_name,
      last_name,
      object_type_id: ObjectType.Users,
      password: userApi.password ? Hash.instance.hashPasswordSync(userApi.password) : undefined,
      user_uid: userApi.uid,
    });
  }

  async create(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const userApi = req.getBody<UserPayloadApi>();

    const { rowCount } = await create(UserController.#toDbObject(userApi));

    if (rowCount === 0) {
      return next(new ServerError());
    }

    res.json(new ServerSuccess());
  }

  async deleteByUid(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const userUid = req.getSearchParam('uid');

    const { rowCount } = await deleteUserByUid(userUid);

    if (rowCount === 0) {
      return next(new ObjectNotFound('user', userUid));
    }

    res.json(new ServerSuccess());
  }

  async getByUid(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const userUid = req.getSearchParam('uid');

    const { rows } = await selectUserByUid(userUid);
    const user = rows.at(0);

    if (!user) {
      return next(new ObjectNotFound('user', userUid));
    }

    res.json(UserController.#toApiObject(user));
  }

  async putByUid(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const userApi = req.getBody<UserPayloadApi>();

    const { rowCount } = await updateUser(UserController.#toDbObject(userApi));

    if (rowCount === 0) {
      return next(new ObjectNotFound('user', userApi.uid));
    }

    const { rows } = await selectUserByUid(userApi.uid);
    const user = rows.at(0);

    if (!user) {
      return next(new ObjectNotFound('user', userApi.uid));
    }

    res.json(UserController.#toApiObject(user));
  }
}
