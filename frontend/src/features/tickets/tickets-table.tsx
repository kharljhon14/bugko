import type { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import type { Ticket } from '@/types/tickets';
import DataTable from '@/components/common/data-table';
import { Badge } from '@/components/ui/badge';

interface Props {
  tickets: Ticket[];
}

export default function TicketsTable({ tickets }: Props) {
  const columns: ColumnDef<Ticket>[] = [
    {
      accessorKey: 'id',
      header: 'ID'
    },
    {
      accessorKey: 'owner_name',
      header: 'Ticket Owner'
    },
    {
      accessorKey: 'assignee_name',
      header: 'Assign To'
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => {
        return <p className="truncate max-w-xs">{row.original.title}</p>;
      }
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        return <p className="truncate max-w-xs">{row.original.description}</p>;
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        switch (row.original.status) {
          case 'open':
            return <Badge className="bg-green-600">Open</Badge>;
          case 'in_progress':
            return <Badge>In Progress</Badge>;
          case 'closed':
            return <Badge className="bg-gray-700">Closed</Badge>;
        }
      }
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
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
      header: 'Updated',
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
      cell: () => {
        return (
          <div className="flex gap-4">
            <Button>View</Button>
            <Button variant="outline">Update</Button>
            <Button variant="destructive">Delete</Button>
          </div>
        );
      }
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={tickets}
    />
  );
}
