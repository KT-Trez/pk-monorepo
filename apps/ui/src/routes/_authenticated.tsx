import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { SideNav } from '@/components/SideNav/SideNav.tsx';
import { useSideNavConfig } from '@/hooks/useSideNavConfig.ts';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ search: { backTo: location.href }, to: '/login' });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const sideNavConfig = useSideNavConfig();

  return (
    <>
      <SideNav className="col-span-2 pr-2 pt-2" config={sideNavConfig} />

      <main className="col-span-10 p-4 pl-2 pt-2">
        <Outlet />
      </main>
    </>
  );
}
