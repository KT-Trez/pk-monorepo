import { createRouter, RouterProvider } from '@tanstack/react-router';
import { useAuth } from '@/components/AuthProvider/useAuth.ts';
import { routeTree } from '@/routeTree.gen.ts';

const router = createRouter({
  context: {
    // biome-ignore lint/style/noNonNullAssertion: auth will be passed down from within a React component
    auth: null!,
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

  return <RouterProvider context={{ auth }} router={router} />;
};
