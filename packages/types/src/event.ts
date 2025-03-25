export type Event = {
  description: null | string;
  // biome-ignore lint/style/useNamingConvention: this is a format of the data from the API
  end_date: number;
  // biome-ignore lint/style/useNamingConvention: this is a format of the data from the API
  event_uid: string;
  location: null | string;
  // biome-ignore lint/style/useNamingConvention: this is a format of the data from the API
  object_type_uid: string;
  // biome-ignore lint/style/useNamingConvention: this is a format of the data from the API
  start_date: number;
  title: string;
};
