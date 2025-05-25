import agent from '@/api/agents';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import type { Ticket } from '@/types/tickets';

import { useMutation, useQueryClient } from '@tanstack/react-query';

interface Props {
  ticket: Ticket;
}

export default function TicketDeleteButton({ ticket }: Props) {
  const queryClient = useQueryClient();

  const deleteTicket = useMutation({
    mutationKey: ['tickets'],
    mutationFn: ({ id }: { id: string }) => agent.tickets.deleteTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    }
  });

  const handleDeleteProject = () => {
    deleteTicket.mutate({ id: ticket.id });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete {ticket.title}?</DialogTitle>
          <DialogDescription>There's no coming back if you delete this.</DialogDescription>
        </DialogHeader>
        <div className="flex justify-between mt-6">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleDeleteProject}
            type="button"
            variant="destructive"
          >
            Delete Ticket
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
