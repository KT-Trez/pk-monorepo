import type { SessionApiCreatePayload } from '@pk/types/session.js';
import { ObjectNotFound } from '../components/response/ObjectNotFound.ts';
import { ServerSuccess } from '../components/response/ServerSuccess.ts';
import { Unauthorized } from '../components/response/Unauthorized.ts';
import { BaseController } from '../components/web/BaseController.ts';
import { Hash } from '../components/web/Hash.ts';
import type { WebServerRequest } from '../components/web/WebServerRequest.ts';
import type { WebServerResponse } from '../components/web/WebServerResponse.ts';
import { enrichedSessionRepository, enrichedUserRepository } from '../main.ts';
import type { NextFunction } from '../types/http.ts';

export class SessionController extends BaseController {
  async create(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const { email, password } = req.getBody<SessionApiCreatePayload>();

    const user = await enrichedUserRepository.findOne({ email });

    if (!user) {
      return next(new Unauthorized(`User with email "${email}" not found`));
    }

    const passwordHash = await Hash.instance.hashPassword(password);
    const hasMatchingPassword = passwordHash.equals(user.password);

    if (!hasMatchingPassword) {
      return next(new Unauthorized(`Invalid password: "${password}"`));
    }

    const session = await enrichedSessionRepository.create({
      user: {
        uid: user.uid,
      },
    });

    const maxAge = new Date(session.expiresAt).getTime() - Date.now();

    res.addHeader('Set-Cookie', `session_uid=${session.uid}; Max-Age: ${maxAge}`).json(session);
  }

  async deleteByUid(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const uid = req.getSearchParam('uid');

    const isSuccess = await enrichedSessionRepository.delete(uid);

    if (!isSuccess) {
      return next(new ObjectNotFound('session', uid));
    }

    res.json(new ServerSuccess());
  }
}
