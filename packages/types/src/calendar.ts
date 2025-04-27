import type { ConstValues } from './helpers.js';

export type EnrichedCalendarApi = {
  authorUid: string | null;
  createdAt: string;
  isPublic: boolean;
  modifiedAt: string;
  name: string;
  sharedWith: Record<string, CalendarShareTypes>;
  uid: string;
};

export type EnrichedCalendarCreateApiPayload = Pick<EnrichedCalendarApi, 'name'> & {
  isPublic?: EnrichedCalendarApi['isPublic'];
  sharedWith?: EnrichedCalendarApi['sharedWith'];
};

export type EnrichedCalendarUpdateApiPayload = Partial<EnrichedCalendarCreateApiPayload> & {
  uid: EnrichedCalendarApi['uid'];
};

export const CalendarShareType = {
  Editor: 'editor',
  Viewer: 'viewer',
} as const;
export type CalendarShareTypes = ConstValues<typeof CalendarShareType>;
