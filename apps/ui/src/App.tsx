import { QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { useCallback, useRef } from 'react';
import { AuthProvider } from '@/components/AuthProvider/AuthProvider.tsx';
import { ThemeProvider } from '@/components/ThemeProvider/ThemeProvider.tsx';
import { makeQueryClient } from '@/utils/query.ts';
import { makeTrpcClient, TRPCProvider } from '@/utils/trpc.ts';
import { Router } from './Router.tsx';

export const App = () => {
  const snackbarRef = useRef<SnackbarProvider>(null);

  const handleQueryError = useCallback((message: string) => {
    snackbarRef.current?.enqueueSnackbar(message, { variant: 'error' });
  }, []);

  const { current: queryClient } = useRef(makeQueryClient({ onError: handleQueryError }));
  const { current: trpcClient } = useRef(makeTrpcClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider queryClient={queryClient} trpcClient={trpcClient}>
        <AuthProvider>
          <ThemeProvider>
            <SnackbarProvider autoHideDuration={10000} ref={snackbarRef}>
              <Router />
            </SnackbarProvider>
          </ThemeProvider>
        </AuthProvider>
      </TRPCProvider>
    </QueryClientProvider>
  );
};
