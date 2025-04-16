import type { SessionApiPayload } from '@pk/types/session.js';
import { ObjectNotFound } from '../components/response/ObjectNotFound.ts';
import { ServerSuccess } from '../components/response/ServerSuccess.ts';
import { SessionFactory } from '../components/session/SessionFactory.ts';
import { BaseController } from '../components/web/BaseController.v3.ts';
import type { WebServerRequest } from '../components/web/WebServerRequest.ts';
import type { WebServerResponse } from '../components/web/WebServerResponse.ts';
import { deleteSessionBySessionUid } from '../queries/session.ts';
import type { NextFunction } from '../types/http.ts';

export class SessionController extends BaseController {
  async create(req: WebServerRequest, res: WebServerResponse, _: NextFunction) {
    const { email, password } = req.getBody<SessionApiPayload>();

    const session = await new SessionFactory(email, password).constructorAsync();

    res.setStatus(session.code).json(session.toResponse());
  }

  async deleteByUid(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const sessionUid = req.getSearchParam('uid');

    const { rowCount } = await deleteSessionBySessionUid(sessionUid);

    if (rowCount === 0) {
      return next(new ObjectNotFound('session', sessionUid));
    }

    res.json(new ServerSuccess());
  }
}
