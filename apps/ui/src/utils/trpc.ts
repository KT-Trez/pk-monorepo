import type { AppRouter } from '@pk/server/src/routers/app.ts';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();

export const makeTrpcClient = () => {
  return createTRPCClient<AppRouter>({
    links: [httpBatchLink({ url: 'http://localhost:4000/trpc' })],
  });
};
