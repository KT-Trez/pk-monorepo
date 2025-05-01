import type {
  EnrichedCalendarApi,
  EnrichedCalendarCreateApiPayload,
  EnrichedCalendarUpdateApiPayload,
} from '@pk/types/calendar.js';
import type { PermissionsByResource } from '@pk/utils/permissions/types.js';
import { Collection } from '../components/response/Collection.ts';
import { Forbidden } from '../components/response/Forbidden.ts';
import { ObjectNotFound } from '../components/response/ObjectNotFound.ts';
import { ServerSuccess } from '../components/response/ServerSuccess.ts';
import { BaseController } from '../components/web/BaseController.ts';
import type { WebServerRequest } from '../components/web/WebServerRequest.ts';
import type { WebServerResponse } from '../components/web/WebServerResponse.ts';
import { enrichedCalendarRepository } from '../main.ts';
import type { NextFunction } from '../types/http.ts';

export class CalendarController extends BaseController {
  async create(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const payload = req.getBody<EnrichedCalendarCreateApiPayload>();

    if (!req.session.hasPermission('calendar', 'create', payload)) {
      return next(new Forbidden('User is missing permissions to create a new calendar'));
    }

    const data: Partial<EnrichedCalendarApi> = {
      ...payload,
      authorUid: req.session.details.user.uid,
    };

    const calendar = await enrichedCalendarRepository.create(data);

    res.json(calendar);
  }

  async deleteByUid(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const uid = req.getSearchParam('uid');

    const calendar = await enrichedCalendarRepository.findOne(uid);

    if (!calendar) {
      return next(new ObjectNotFound('calendar', uid));
    }

    if (!req.session.hasPermission('calendar', 'delete', calendar)) {
      return next(new Forbidden(`User is missing permissions to delete the calendar "${uid}"`));
    }

    await enrichedCalendarRepository.delete(uid);

    res.json(new ServerSuccess());
  }

  async getAll(req: WebServerRequest, res: WebServerResponse) {
    const { limit, offset } = super.getPaginationParams(req);

    const calendars = await enrichedCalendarRepository.find({}, { limit, offset, orderBy: 'name' });

    const items = calendars.filter(item => req.session.hasPermission('calendar', 'read', item));
    const hasMore = items.length === limit;

    res.json(new Collection({ hasMore, items, limit, offset }));
  }

  async updateByUid(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const payload = req.getBody<EnrichedCalendarUpdateApiPayload>();
    const uid = payload.uid;

    const calendar = await enrichedCalendarRepository.findOne(uid);

    if (!calendar) {
      return next(new ObjectNotFound('calendar', uid));
    }

    if (!req.session.hasPermission('calendar', 'update', { calendar, payload })) {
      return next(new Forbidden(`User is missing permissions to update the calendar "${uid}"`));
    }

    const updatedCalendar = await enrichedCalendarRepository.update(uid, payload);

    res.json(updatedCalendar);
  }

  updateSharedWith<A extends keyof PermissionsByResource['calendar']>(action: Extract<A, 'follow' | 'unfollow'>) {
    return async (req: WebServerRequest, res: WebServerResponse, next: NextFunction) => {
      const payload = req.getBody<EnrichedCalendarUpdateApiPayload>();
      const uid = payload.uid;

      const calendar = await enrichedCalendarRepository.findOne(uid);

      if (!calendar) {
        return next(new ObjectNotFound('calendar', uid));
      }

      if (!req.session.hasPermission('calendar', action, calendar)) {
        return next(
          new Forbidden(`User is missing permissions to update the "sharedWith" property in calendar "${uid}"`),
        );
      }

      const updatedCalendar = await enrichedCalendarRepository.update(uid, payload);

      res.json(updatedCalendar);
    };
  }
}
