import type { UserPayloadApi } from './user.js';

export type SessionApiPayload = Required<Pick<UserPayloadApi, 'email' | 'password'>>;

export type SessionDb = {
  acl: number;
  expires_at: Date;
  session_uid: string;
  user_uid: string;
};

export type SessionApi = {
  acl: string;
  expiresAt: string;
  sessionUid: string;
  userUid: string;
};
