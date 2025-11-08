import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { isTRPCClientError } from '@trpc/client';

type MakeQueryClientParameters = {
  onError: (message: string) => void;
};

export const makeQueryClient = ({ onError }: MakeQueryClientParameters) => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
    mutationCache: new MutationCache({
      onError: error => {
        const message = isTRPCClientError(error) ? error.message : 'An unexpected error occurred';

        console.error('Mutation error:', error);
        onError(message);
      },
    }),
    queryCache: new QueryCache({
      onError: error => {
        const message = isTRPCClientError(error) ? error.message : 'An unexpected error occurred';

        console.error('Query error:', error);
        onError(message);
      },
    }),
  });
};
