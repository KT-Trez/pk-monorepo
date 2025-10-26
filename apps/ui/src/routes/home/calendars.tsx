import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home/calendars')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/home/calendars"!</div>
}
