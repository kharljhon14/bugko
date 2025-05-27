import UserTicketsContainer from '@/features/home/user-tickets-container';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div>
      <UserTicketsContainer />
    </div>
  );
}
