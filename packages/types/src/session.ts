import type { FullUserApi } from './user.js';

export type EnrichedSessionApi = {
  createdAt: string;
  expiresAt: string;
  uid: string;
  user: FullUserApi;
};

export type SessionApiCreatePayload = {
  email: string;
  password: string;
};
