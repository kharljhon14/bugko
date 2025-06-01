import type { Ticket, TicketWithProjectName } from '@/types/tickets';

import { useQuery } from '@tanstack/react-query';
import agent from '@/api/agents';

import { useState } from 'react';

import type { GenericResponseArray } from '@/types/response';
import type { PaginationState } from '@tanstack/react-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TicketForm from '../tickets/ticket-form';
import UserTicketsTable from './user-tickets-table';

export default function UserTicketsContainer() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | undefined>();
  const [openFormModal, setOpenFormModal] = useState(false);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });

  const { data, isError, error, isLoading } = useQuery<GenericResponseArray<TicketWithProjectName>>(
    {
      queryKey: ['tickets', pagination.pageIndex + 1],
      queryFn: () => agent.tickets.getAllTicketByAssignee(pagination.pageIndex + 1)
    }
  );

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
      <div className="mb-4 flex items-center justify-between">
        <div className="flex space-x-4">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">My Tickets</h1>
            <p className="text-gray-600 text-sm">
              View and manage all active tickets assigned to you.
            </p>
          </div>
          <div>
            <Dialog
              open={openFormModal}
              onOpenChange={setOpenFormModal}
            >
              {/* <DialogTrigger
                onClick={handleOpenDialog}
                className={buttonVariants({ variant: 'default' })}
              >
                Create Ticket
              </DialogTrigger> */}
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{selectedTicket ? 'Update Ticket' : 'Create Ticket'}</DialogTitle>
                </DialogHeader>
                <TicketForm
                  projectID={selectedTicket?.project_id ?? ''}
                  selectedTicket={selectedTicket}
                  setOpenFormModal={setOpenFormModal}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <UserTicketsTable
        tickets={data?.data ?? []}
        pagination={pagination}
        setPagination={setPagination}
        totalPage={data?._metadata.lastPage ?? 1}
        setOpenFormModal={setOpenFormModal}
        setSelectedTicket={setSelectedTicket}
      />
    </div>
  );
}
