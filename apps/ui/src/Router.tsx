import { useQueryClient } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { useAuth } from '@/components/AuthProvider/useAuth.ts';
import { routeTree } from '@/routeTree.gen.ts';
import { useTRPC } from './utils/trpc.ts';

const router = createRouter({
  context: {
    // biome-ignore lint/style/noNonNullAssertion: auth will be passed down from within a React component
    auth: null!,
    // biome-ignore lint/style/noNonNullAssertion: queryClient will be passed down from within a React component
    queryClient: null!,
    // biome-ignore lint/style/noNonNullAssertion: trpcClient will be passed down from within a React component
    trpcClient: null!,
  },
  routeTree,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const Router = () => {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const trpcClient = useTRPC();

  return <RouterProvider context={{ auth, queryClient, trpcClient }} router={router} />;
};
