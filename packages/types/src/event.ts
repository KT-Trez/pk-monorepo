import type { CalendarDb } from './calendar.js';

export type EventApi = {
  calendar_uid: string;
  description: null | string;
  end_date: string;
  location: null | string;
  start_date: string;
  title: string;
  uid: string;
};

export type EventDb = EventApi & {
  calendar: CalendarDb;
};
