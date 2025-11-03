import { createRootRoute, Outlet } from '@tanstack/react-router';
import { SideNav } from '@/components/SideNav/SideNav.tsx';
import { useSideNavConfig } from '@/hooks/useSideNavConfig.ts';

export const Route = createRootRoute({ component: RootLayout });

function RootLayout() {
  const sideNavConfig = useSideNavConfig();

  return (
    <div className="grid grid-cols-12 h-screen">
      <SideNav className="col-span-2" config={sideNavConfig} />

      <div className="col-span-10">
        <Outlet />
      </div>
    </div>
  );
}
