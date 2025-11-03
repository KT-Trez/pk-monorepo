import { createFileRoute } from '@tanstack/react-router';
import { UsersList } from '@/modules/admin/users/List/UsersList.tsx';

export const Route = createFileRoute('/admin/users')({
  component: RouteComponent,
});

function RouteComponent() {
  return <UsersList />;
}
