import TicketView from '@/features/tickets/ticket-view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/tickets/$ticketId')({
  component: RouteComponent
});

function RouteComponent() {
  const { ticketId } = Route.useParams();

  return <TicketView ticketId={ticketId} />;
}
