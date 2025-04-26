import type { EnrichedUserApi, EnrichedUserApiCreatePayload, EnrichedUserApiUpdatePayload } from '@pk/types/user.js';
import { Collection } from '../components/response/Collection.ts';
import { Forbidden } from '../components/response/Forbidden.ts';
import { ServerSuccess } from '../components/response/ServerSuccess.ts';
import { BaseController } from '../components/web/BaseController.ts';
import { Hash } from '../components/web/Hash.ts';
import type { WebServerRequest } from '../components/web/WebServerRequest.ts';
import type { WebServerResponse } from '../components/web/WebServerResponse.ts';
import { enrichedUserRepository, fullUserRepository } from '../main.ts';
import type { NextFunction } from '../types/http.ts';

export class UserController extends BaseController {
  async create(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const { password, ...payload } = req.getBody<EnrichedUserApiCreatePayload>();

    if (!req.session.hasPermission('user', 'create')) {
      return next(new Forbidden('User is missing permissions to create a new user'));
    }

    if (payload.roles.includes('admin') && !req.session.user?.roles.includes('admin')) {
      return next(new Forbidden('User is missing permissions to create an admin user'));
    }

    const data: Partial<EnrichedUserApi> = {
      ...payload,
      password: await Hash.instance.hashPassword(password),
    };

    const user = await enrichedUserRepository.create(data);

    res.json(user);
  }

  async deleteByUid(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const uid = req.getSearchParam('uid');

    const user = await fullUserRepository.findOne(uid);

    if (!req.session.hasPermission('user', 'delete', user)) {
      return next(new Forbidden(`User is missing permissions to delete the user "${uid}"`));
    }

    await fullUserRepository.delete(uid);

    res.json(new ServerSuccess());
  }

  async getAll(req: WebServerRequest, res: WebServerResponse) {
    const limit = req.getOptionalSearchParam('limit');
    const normalizedLimit = limit ? Number.parseInt(limit) : 10;
    const offset = req.getOptionalSearchParam('offset');
    const normalizedOffset = offset ? Number.parseInt(offset) : 0;

    const items = await fullUserRepository.find(
        {},
        { limit: normalizedLimit, offset: normalizedOffset, orderBy: 'name' },
    );
    const collection = new Collection({
      hasMore: items.length === normalizedLimit - normalizedOffset,
      items,
      limit: normalizedLimit,
      offset: normalizedOffset,
    });

    res.json(collection);
  }

  async getByUid(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const uid = req.getSearchParam('uid');

    const user = await fullUserRepository.findOne(uid);

    if (!req.session.hasPermission('user', 'read', user)) {
      return next(new Forbidden(`User is missing permissions to read the user "${uid}"`));
    }

    res.json(user);
  }

  async updateByUid(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const { password, ...payload } = req.getBody<EnrichedUserApiUpdatePayload>();
    const uid = payload.uid;

    const user = await fullUserRepository.findOne(uid);

    if (!req.session.hasPermission('user', 'update', user)) {
      return next(new Forbidden(`User is missing permissions to update the user "${uid}"`));
    }

    const data: Partial<EnrichedUserApi> = {
      ...payload,
      ...(password ? { password: await Hash.instance.hashPassword(password) } : {}),
    };

    const newUser = await enrichedUserRepository.update({ uid: payload.uid }, data);

    res.json(newUser);
  }
}
