import type { ObjectType } from './objectType.js';

export type EventDb = {
  description: null | string;
  // biome-ignore lint/style/useNamingConvention: this is a format of the data from the API
  end_date: string;
  // biome-ignore lint/style/useNamingConvention: this is a format of the data from the API
  event_uid: string;
  location: null | string;
  // biome-ignore lint/style/useNamingConvention: this is a format of the data from the API
  object_type_id: typeof ObjectType.event;
  // biome-ignore lint/style/useNamingConvention: this is a format of the data from the API
  start_date: string;
  title: string;
};
