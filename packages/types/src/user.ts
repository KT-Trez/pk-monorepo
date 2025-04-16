import type { ObjectType } from './objectType.js';

export type UserApi = {
  album: number;
  email: string;
  name: string;
  uid: string;
};

export type UserPayloadApi = Pick<UserApi, 'album' | 'email' | 'name' | 'uid'> & {
  password: string;
};

export type UserDb = {
  album: number;
  email: string;
  first_name: string;
  last_name: string;
  object_type_id: typeof ObjectType.Users;
  password: Buffer<ArrayBufferLike>;
  user_uid: string;
};
