import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/home/events')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/home/events"!</div>;
}
