import { UsersList } from '@/modules/admin/users/List/UsersList.tsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/users')({
  component: RouteComponent,
});

function RouteComponent() {
  return <UsersList />;
}
