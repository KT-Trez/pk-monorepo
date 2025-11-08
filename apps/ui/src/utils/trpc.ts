import type { AppRouter } from '@pk/server/src/routers/app.ts';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import superjson from 'superjson';

let AuthorizationHeader: string | undefined;

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();

export const setAuthorizationHeader = (newHeader: string | undefined) => {
  AuthorizationHeader = newHeader;
};

export const makeTrpcClient = () => {
  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        headers: () => ({ Authorization: AuthorizationHeader }),
        transformer: superjson,
        url: '/trpc',
      }),
    ],
  });
};
