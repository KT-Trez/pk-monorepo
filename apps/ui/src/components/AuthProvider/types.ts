import type { SessionApi } from '@pk/types/session.js';

export type AuthProviderState = {
  getSession: () => SessionApi;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<unknown>;
  logout: () => Promise<void>;
  session: SessionApi | null;
};
