import type { EnrichedEventApi } from '@pk/types/event.js';

export type EventsGroupedByDay = {
  date: Date;
  events: EnrichedEventApi[];
};
