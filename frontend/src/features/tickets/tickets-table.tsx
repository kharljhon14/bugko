import type { ColumnDef, OnChangeFn, PaginationState } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import type { Ticket } from '@/types/tickets';
import DataTable from '@/components/common/data-table';

import TicketDeleteButton from './ticket-delete-button';
import { Link } from '@tanstack/react-router';
import { renderPriority, renderStatus } from '@/utils/renderers';
import { ArrowUpDown } from 'lucide-react';

interface Props {
  tickets: Ticket[];
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  totalPage: number;
  setSelectedTicket: (ticket: Ticket) => void;
  setOpenFormModal: (value: boolean) => void;
}

export default function TicketsTable({
  tickets,
  pagination,
  setPagination,
  totalPage,
  setSelectedTicket,
  setOpenFormModal
}: Props) {
  const handleUpdateTicket = (data: Ticket) => {
    setSelectedTicket(data);
    setOpenFormModal(true);
  };

  const columns: ColumnDef<Ticket>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => {
        return (
          <p className={`truncate ${row.original.status === 'closed' && 'line-through'}`}>
            {row.original.id}
          </p>
        );
      }
    },
    {
      accessorKey: 'owner_name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Ticket Owner
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <p className={`truncate  ${row.original.status === 'closed' && 'line-through'}`}>
            {row.original.owner_name}
          </p>
        );
      }
    },
    {
      accessorKey: 'assignee_name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Assign To
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <p className={`truncate ${row.original.status === 'closed' && 'line-through'}`}>
            {row.original.assignee_name}
          </p>
        );
      }
    },
    {
      accessorKey: 'title',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <p className={`truncate ${row.original.status === 'closed' && 'line-through'}`}>
            {row.original.title}
          </p>
        );
      }
    },
    // {
    //   accessorKey: 'description',
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    //       >
    //         Description
    //         <ArrowUpDown className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },
    //   cell: ({ row }) => {
    //     return (
    //       <p
    //         className={`truncate max-w-[80px] ${
    //           row.original.status === 'closed' && 'line-through'
    //         }`}
    //       >
    //         {row.original.description}
    //       </p>
    //     );
    //   }
    // },
    {
      accessorKey: 'priority',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Priority
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return renderPriority(row.original.priority);
      }
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return renderStatus(row.original.status);
      }
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      accessorFn: ({ created_at: createdAt }) => {
        const date = new Date(createdAt);

        const formattedDate = new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(date);

        return formattedDate;
      }
    },

    {
      accessorKey: 'updated_at',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Updated
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      accessorFn: ({ updated_at: updatedAt }) => {
        const date = new Date(updatedAt);

        const formattedDate = new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(date);

        return formattedDate;
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <div className="flex gap-4">
            <Button asChild>
              <Link
                to="/tickets/$ticketId"
                params={{ ticketId: row.original.id }}
              >
                View
              </Link>
            </Button>
            <Button
              onClick={() => handleUpdateTicket(row.original)}
              variant="outline"
            >
              Update
            </Button>
            {/* <Button variant="destructive">Delete</Button> */}
            <TicketDeleteButton ticket={row.original} />
          </div>
        );
      }
    }
  ];

  return (
    <DataTable
      pagination={pagination}
      setPagination={setPagination}
      totalPage={totalPage}
      columns={columns}
      data={tickets}
    />
  );
}
