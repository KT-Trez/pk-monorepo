import type { ObjectType } from './objectType.js';

export type EventDb = {
  description: null | string;
  // biome-ignore lint/style/useNamingConvention: this is a database field
  end_date: string;
  // biome-ignore lint/style/useNamingConvention: this is a database field
  event_uid: string;
  location: null | string;
  // biome-ignore lint/style/useNamingConvention: this is a database field
  object_type_id: typeof ObjectType.event;
  // biome-ignore lint/style/useNamingConvention: this is a database field
  start_date: string;
  title: string;
};
