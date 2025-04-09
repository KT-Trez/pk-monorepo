import type { ObjectType } from './objectType.js';

export type EventApi = {
  description: null | string;
  endDate: string;
  location: null | string;
  startDate: string;
  title: string;
  type: typeof ObjectType.event;
  uid: string;
};

export type EventDb = {
  description: null | string;
  end_date: string;
  event_uid: string;
  location: null | string;
  object_type_id: typeof ObjectType.event;
  start_date: string;
  title: string;
};
