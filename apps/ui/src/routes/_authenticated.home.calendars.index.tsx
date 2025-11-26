import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import { ListPage } from '../components/Page/ListPage.tsx';
import type { ListPageAction } from '../components/Page/types.ts';
import { CalendarsList } from '../modules/home/calendars/List/CalendarsList.tsx';

export const Route = createFileRoute('/_authenticated/home/calendars/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();

  const actions = useMemo<ListPageAction[]>(
    () => [
      {
        label: 'Create new calendar',
        onClick: () => navigate({ to: '/home/calendars/create' }),
      },
    ],
    [navigate],
  );

  return (
    <ListPage actions={actions}>
      <CalendarsList />
    </ListPage>
  );
}
