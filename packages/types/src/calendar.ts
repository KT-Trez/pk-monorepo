import type { ConstValues } from './helpers.js';

export type CalendarApi = {
  author_uid: string | null;
  is_public: boolean;
  name: string;
  uid: string;
};

export type CalendarDb = CalendarApi & {
  shared_with: Record<string, CalendarShareTypes>;
};

export const CalendarShareType = {
  Editor: 'editor',
  Viewer: 'viewer',
} as const;
export type CalendarShareTypes = ConstValues<typeof CalendarShareType>;
