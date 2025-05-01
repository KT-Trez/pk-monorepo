import type { EnrichedCalendarApi } from '@pk/types/calendar.js';
import type { EnrichedEventApi, EventApi, EventApiCreatePayload } from '@pk/types/event.js';
import { Collection } from '../components/response/Collection.ts';
import { Forbidden } from '../components/response/Forbidden.ts';
import { ObjectNotFound } from '../components/response/ObjectNotFound.ts';
import { ServerSuccess } from '../components/response/ServerSuccess.ts';
import { BaseController } from '../components/web/BaseController.ts';
import type { WebServerRequest } from '../components/web/WebServerRequest.ts';
import type { WebServerResponse } from '../components/web/WebServerResponse.ts';
import { enrichedCalendarRepository, eventRepository } from '../main.ts';
import type { NextFunction } from '../types/http.ts';

export class EventController extends BaseController {
  async create(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const payload = req.getBody<EventApiCreatePayload>();

    const calendar = await enrichedCalendarRepository.findOne({ uid: payload.calendarUid });

    if (!req.session.hasPermission('event', 'create', { event: payload, calendar })) {
      return next(new Forbidden('User is missing permissions to create a new event'));
    }

    const data: Partial<EventApi> = {
      ...payload,
      authorUid: req.session.details.user.uid,
    };

    const event = await eventRepository.create(data);

    res.json(event);
  }

  async deleteByUid(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const uid = req.getSearchParam('uid');

    const event = await eventRepository.findOne(uid);
    const calendar = await enrichedCalendarRepository.findOne({ uid: event?.calendarUid });

    if (!event) {
      return next(new ObjectNotFound('event', uid));
    }

    if (!req.session.hasPermission('event', 'delete', { event, calendar })) {
      return next(new Forbidden(`User is missing permissions to delete the event "${uid}"`));
    }

    await eventRepository.delete(uid);

    res.json(new ServerSuccess());
  }

  async getAll(req: WebServerRequest, res: WebServerResponse) {
    const { limit, offset } = super.getPaginationParams(req);

    const calendars = await enrichedCalendarRepository.find({});
    const events = await eventRepository.find({}, { limit, offset, orderBy: 'startDate' });

    const calendarsMap = calendars.reduce<Record<string, EnrichedCalendarApi>>((acc, calendar) => {
      acc[calendar.uid] = calendar;

      return acc;
    }, {});

    const items = events.reduce<EnrichedEventApi[]>((acc, event) => {
      const calendar = calendarsMap[event.calendarUid];

      if (calendar && req.session.hasPermission('event', 'read', { event, calendar })) {
        acc.push({ ...event, calendar: calendar });
      }

      return acc;
    }, []);
    const hasMore = items.length === limit;

    res.json(new Collection({ hasMore, items, limit, offset }));
  }

  async updateByUid(req: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const payload = req.getBody<Partial<EventApi>>();
    const uid = payload.uid;

    const event = await eventRepository.findOne(uid);
    const calendar = await enrichedCalendarRepository.findOne({ uid: event?.calendarUid });

    if (!event) {
      return next(new ObjectNotFound('event', uid));
    }

    if (!req.session.hasPermission('event', 'update', { event, calendar })) {
      return next(new Forbidden(`User is missing permissions to update the event "${uid}"`));
    }

    const updatedEvent = await eventRepository.update(uid, payload);

    res.json(updatedEvent);
  }
}
