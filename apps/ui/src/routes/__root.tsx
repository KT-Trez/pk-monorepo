import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import type { AuthProviderState } from '@/components/AuthProvider/types.ts';
import { TopBar } from '@/components/TopBar/TopBar.tsx';
import type { useTRPC } from '../utils/trpc.ts';

type RouterContext = {
  auth: AuthProviderState;
  queryClient: QueryClient;
  trpcClient: ReturnType<typeof useTRPC>;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="grid grid-cols-12  grid-rows-[auto_1fr] h-screen">
      <TopBar className="pb-2" />
      <Outlet />
    </div>
  );
}
