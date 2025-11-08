import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import { UsersList } from '@/modules/admin/users/List/UsersList.tsx';
import { ListPage } from '../components/Page/ListPage.tsx';
import type { ListPageAction } from '../components/Page/types.ts';

export const Route = createFileRoute('/_authenticated/admin/users/')({
  component: RouteComponent,
  loader: ctx => {
    ctx.context.queryClient.ensureQueryData(ctx.context.trpcClient.v1.user.userList.queryOptions());
  },
});

function RouteComponent() {
  const navigate = Route.useNavigate();

  const actions = useMemo<ListPageAction[]>(
    () => [
      {
        label: 'Create new user',
        onClick: () => navigate({ to: '/admin/users/create' }),
      },
    ],
    [navigate],
  );

  return (
    <ListPage actions={actions}>
      <UsersList />
    </ListPage>
  );
}
