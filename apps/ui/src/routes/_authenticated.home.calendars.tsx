import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/home/calendars')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/home/calendars"!</div>;
}
