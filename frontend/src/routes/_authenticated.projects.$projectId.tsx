import agent from '@/api/agents';
import ProjectTicketsTable from '@/features/projects/project-tickets-table';
import type { GenericResponseArray } from '@/types/response';
import type { Ticket } from '@/types/tickets';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/projects/$projectId')({
  component: RouteComponent
});

function RouteComponent() {
  const { projectId } = Route.useParams();

  const { data, isError, error, isLoading } = useQuery<GenericResponseArray<Ticket>>({
    queryKey: ['tickets'],
    queryFn: () => agent.tickets.getAllTicketByProject(projectId)
  });

  if (isError || error) {
    return <div>Something went wrong!</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <ProjectTicketsTable tickets={data?.data ?? []} />;
}
