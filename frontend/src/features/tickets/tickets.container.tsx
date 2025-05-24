import type { Ticket } from '@/types/tickets';
import TicketsTable from './tickets-table';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { useQuery } from '@tanstack/react-query';
import agent from '@/api/agents';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface Props {
  tickets: Ticket[];
  projectId: string;
}

export default function TicketsContainer({ tickets, projectId }: Props) {
  const { data } = useQuery({
    queryKey: ['project'],
    queryFn: () => agent.projects.getProjectByID(projectId)
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex space-x-4">
          <Button
            variant="outline"
            size="icon"
            asChild
          >
            <Link to="/">
              <ChevronLeft />
            </Link>
          </Button>

          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {data?.data.name} Tickets Overview
            </h1>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Projects</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{data?.data.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div>
          <Button size="lg">Create Ticket</Button>
        </div>
      </div>
      <TicketsTable tickets={tickets} />
    </div>
  );
}
