import { createFileRoute } from '@tanstack/react-router';
import { UserForm } from '../modules/admin/users/Form/UserForm.tsx';

export const Route = createFileRoute('/_authenticated/admin/users/create')({
  component: RouteComponent,
});

function RouteComponent() {
  return <UserForm />;
}
