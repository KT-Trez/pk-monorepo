import { createFileRoute } from '@tanstack/react-router';
import { CalendarForm } from '../modules/home/calendars/Form/CalendarForm.tsx';

export const Route = createFileRoute('/_authenticated/home/calendars/create')({
  component: RouteComponent,
});

function RouteComponent() {
  return <CalendarForm />;
}
