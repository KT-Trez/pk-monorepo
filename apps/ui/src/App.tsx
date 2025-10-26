import { makeQueryClient } from '@/utils/query.ts';
import { TRPCProvider, makeTrpcClient } from '@/utils/trpc.ts';
import { QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { useRef } from 'react';

export const App = () => {
  const { current: queryClient } = useRef(makeQueryClient()); // todo: implement global error handling
  const snackbarRef = useRef<SnackbarProvider>(null);
  const { current: trpcClient } = useRef(makeTrpcClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <SnackbarProvider ref={snackbarRef}>
          <div>page works!</div>
        </SnackbarProvider>
      </TRPCProvider>
    </QueryClientProvider>
  );
};
