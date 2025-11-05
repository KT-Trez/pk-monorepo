import type { SessionApi } from '@pk/types/session.js';
import { useMutation } from '@tanstack/react-query';
import { type ReactNode, useMemo, useState } from 'react';
import { AuthProviderContext } from '@/components/AuthProvider/context.ts';
import type { AuthProviderState } from '@/components/AuthProvider/types.ts';
import { useSessionStorage } from '../../hooks/useSessionStorage.ts';
import { useTRPC } from '../../utils/trpc.ts';
import { sessionSessionStorageKey } from './constants.ts';

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useSessionStorage<SessionApi>(sessionSessionStorageKey);

  const trpc = useTRPC();
  const { isPending, mutateAsync } = useMutation(
    trpc.v1.session.login.mutationOptions({
      onSuccess: session => {
        setSession(session);
      },
    }),
  );

  const value = useMemo<AuthProviderState>(
    () => ({
      getSession: () => {
        if (!session) {
          throw new Error('No session available');
        }

        return session;
      },
      isAuthenticated: session !== null,
      isLoading: isPending,
      login: async (email, password) => mutateAsync({ email, password }),
      logout: async () => {
        setSession(null);
      },
      session,
    }),
    [isPending, mutateAsync, session, setSession],
  );

  return <AuthProviderContext value={value}>{children}</AuthProviderContext>;
};
