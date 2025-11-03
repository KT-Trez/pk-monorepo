import { QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { SnackbarProvider } from 'notistack';
import { useRef } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider/ThemeProvider.tsx';
import { routeTree } from '@/routeTree.gen.ts';
import { makeQueryClient } from '@/utils/query.ts';
import { makeTrpcClient, TRPCProvider } from '@/utils/trpc.ts';

const router = createRouter({ routeTree });

export const App = () => {
  const { current: queryClient } = useRef(makeQueryClient()); // todo: implement global error handling
  const snackbarRef = useRef<SnackbarProvider>(null);
  const { current: trpcClient } = useRef(makeTrpcClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider queryClient={queryClient} trpcClient={trpcClient}>
        <ThemeProvider>
          <SnackbarProvider ref={snackbarRef}>
            <RouterProvider router={router} />
          </SnackbarProvider>
        </ThemeProvider>
      </TRPCProvider>
    </QueryClientProvider>
  );
};
