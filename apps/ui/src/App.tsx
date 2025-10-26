import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { useRef } from 'react';

export const App = () => {
  const { current: queryClient } = useRef(new QueryClient()); // todo: implement global error handling
  const snackbarRef = useRef<SnackbarProvider>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider ref={snackbarRef}>
        <div>page works!</div>
      </SnackbarProvider>
    </QueryClientProvider>
  );
};
