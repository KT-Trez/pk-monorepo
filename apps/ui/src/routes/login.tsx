import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { LoginForm } from '@/modules/login/LoginForm';
import { FullPage } from '../components/Page/FullPage.tsx';
import type { FileRoutesByTo } from '../routeTree.gen.ts';

const loginSearchSchema = z.object({
  backTo: z.string().catch('/home/events' satisfies keyof FileRoutesByTo),
});

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/home/events' });
    }
  },
  component: RouteComponent,
  validateSearch: loginSearchSchema,
});

function RouteComponent() {
  return (
    <FullPage>
      <LoginForm />
    </FullPage>
  );
}
