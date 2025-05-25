import TicketsContainer from '@/features/tickets/tickets-container';

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/projects/$projectId')({
  component: RouteComponent
});

function RouteComponent() {
  const { projectId } = Route.useParams();

  return <TicketsContainer projectId={projectId} />;
}
