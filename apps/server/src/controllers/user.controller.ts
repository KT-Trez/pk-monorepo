import {
  type EnrichedUserApi,
  type EnrichedUserApiCreatePayload,
  type EnrichedUserApiUpdatePayload,
  UserRole,
} from '@pk/types/user.js';
import { Collection } from '../components/response/Collection.ts';
import { Forbidden } from '../components/response/Forbidden.ts';
import { ObjectNotFound } from '../components/response/ObjectNotFound.ts';
import { ServerSuccess } from '../components/response/ServerSuccess.ts';
import { BaseController } from '../components/web/BaseController.ts';
import { Hash } from '../components/web/Hash.ts';
import type { WebServerRequest } from '../components/web/WebServerRequest.ts';
import type { WebServerResponse } from '../components/web/WebServerResponse.ts';
import { enrichedUserRepository, fullUserRepository } from '../main.ts';
import type { NextFunction } from '../types/http.ts';

export class UserController extends BaseController {
  async create(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const payload = req.getBody<EnrichedUserApiCreatePayload>();

    if (!req.session.hasPermission('user', 'create', payload)) {
      return next(new Forbidden('User is missing permissions to create a new user'));
    }

    const data: Partial<EnrichedUserApi> = {
      ...payload,
      password: await Hash.instance.hashPassword(payload.password),
    };

    const { password: _, ...user } = await enrichedUserRepository.create(data);

    res.json(user);
  }

  async deleteByUid(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const uid = req.getSearchParam('uid');

    const user = await fullUserRepository.findOne(uid);

    if (!user) {
      return next(new ObjectNotFound('user', uid));
    }

    if (!req.session.hasPermission('user', 'delete', user)) {
      return next(new Forbidden(`User is missing permissions to delete the user "${uid}"`));
    }

    await fullUserRepository.delete(uid);

    res.json(new ServerSuccess());
  }

  async getAll(req: WebServerRequest, res: WebServerResponse) {
    const { limit, offset } = super.getPaginationParams(req);

    const users = await fullUserRepository.find({}, { limit, offset, orderBy: 'name' });

    const items = users.filter(item => req.session.hasPermission('user', 'read', item));
    const hasMore = items.length === limit;

    res.json(new Collection({ hasMore, items, limit, offset }));
  }

  async getByUid(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const uid = req.getSearchParam('uid');

    const user = await fullUserRepository.findOne(uid);

    if (!user) {
      return next(new ObjectNotFound('user', uid));
    }

    if (!req.session.hasPermission('user', 'read', user)) {
      return next(new Forbidden(`User is missing permissions to read the user "${uid}"`));
    }

    res.json(user);
  }

  async updateByUid(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const { password, ...payload } = req.getBody<EnrichedUserApiUpdatePayload>();
    const uid = payload.uid;

    const user = await fullUserRepository.findOne(uid);

    if (!user) {
      return next(new ObjectNotFound('user', uid));
    }

    if (!req.session.hasPermission('user', 'update', user)) {
      return next(new Forbidden(`User is missing permissions to update the user "${uid}"`));
    }

    const isAdmin = req.session.details.user.roles.includes(UserRole.Admin);
    const isEditingName = payload.name !== undefined || payload.surname !== undefined;
    const isEditingRoles = payload.roles !== undefined;

    if ((isEditingName || isEditingRoles) && !isAdmin) {
      return next(new Forbidden('Only administrators can modify "name", "surname", and "roles" fields'));
    }

    const data: Partial<EnrichedUserApi> = {
      ...payload,
      ...(password ? { password: await Hash.instance.hashPassword(password) } : {}),
    };

    const { password: _, ...updatedUser } = (await enrichedUserRepository.update({ uid: payload.uid }, data)) ?? {};

    res.json(updatedUser);
  }
}
