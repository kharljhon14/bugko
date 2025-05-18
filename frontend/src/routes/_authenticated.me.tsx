import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/me')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/me"!</div>
}
