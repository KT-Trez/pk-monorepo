import type { EnrichedCalendarApi } from './calendar.js';

export type EventApi = {
  authorUid: string;
  calendarUid: string;
  createdAt: string;
  description: string | null;
  endDate: string;
  location: string | null;
  modifiedAt: string;
  startDate: string;
  title: string;
  uid: string;
};

export type EnrichedEventApi = EventApi & {
  calendar: EnrichedCalendarApi;
};

export type EventApiCreatePayload = Pick<EventApi, 'calendarUid' | 'endDate' | 'startDate' | 'title'> & {
  description?: EventApi['description'];
  location?: EventApi['location'];
};

export type EventApiUpdatePayload = Partial<EventApiCreatePayload> & {
  uid: EventApi['uid'];
};
