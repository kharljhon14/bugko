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
import { Button, buttonVariants } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import TicketForm from './ticket-form';
import type { GenericResponseArray } from '@/types/response';
import type { PaginationState } from '@tanstack/react-table';

interface Props {
  projectId: string;
}

export default function TicketsContainer({ projectId }: Props) {
  const projectQuery = useQuery({
    queryKey: ['project'],
    queryFn: () => agent.projects.getProjectByID(projectId)
  });

  const [selectedTicket, setSelectedTicket] = useState<Ticket | undefined>();
  const [openFormModal, setOpenFormModal] = useState(false);

  const handleOpenDialog = () => {
    setOpenFormModal(true);
    setSelectedTicket(undefined);
  };

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });

  const { data, isError, error, isLoading } = useQuery<GenericResponseArray<Ticket>>({
    queryKey: ['tickets', pagination.pageIndex + 1],
    queryFn: () => agent.tickets.getAllTicketByProject(projectId, pagination.pageIndex + 1)
  });

  if (isError || error) {
    return (
      <div className="text-red-600">Oops! Something went wrong while fetching your tickets.</div>
    );
  }

  if (isLoading) {
    return <div>Loading your tickets...</div>;
  }

  return (
    <div>
      <div className="mb-4 flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="flex space-x-4">
          <Button
            variant="outline"
            size="icon"
            asChild
          >
            <Link to="/projects">
              <ChevronLeft />
            </Link>
          </Button>

          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {projectQuery.data?.data.name} Tickets Overview
            </h1>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{projectQuery.data?.data.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <Dialog
          open={openFormModal}
          onOpenChange={setOpenFormModal}
        >
          <DialogTrigger
            onClick={handleOpenDialog}
            className={buttonVariants({ variant: 'default', size: 'lg' })}
          >
            Create Ticket
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedTicket ? 'Update Ticket' : 'Create Ticket'}</DialogTitle>
            </DialogHeader>
            <TicketForm
              projectID={projectId}
              selectedTicket={selectedTicket}
              setOpenFormModal={setOpenFormModal}
            />
          </DialogContent>
        </Dialog>
      </div>

      <TicketsTable
        tickets={data?.data ?? []}
        pagination={pagination}
        setPagination={setPagination}
        totalPage={data?._metadata.lastPage ?? 1}
        setSelectedTicket={setSelectedTicket}
        setOpenFormModal={setOpenFormModal}
      />
    </div>
  );
}
