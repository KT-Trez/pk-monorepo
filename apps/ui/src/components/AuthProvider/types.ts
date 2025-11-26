import type { SessionApi } from '@pk/types/session.js';
import type { UserRoles } from '@pk/types/user.js';

export type AuthProviderState = {
  getSession: () => SessionApi;
  hasRole: (role: UserRoles) => boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<unknown>;
  logout: () => Promise<void>;
  session: SessionApi | null;
};
