import type { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import type { Ticket } from '@/types/tickets';
import DataTable from '@/components/common/data-table';

interface Props {
  tickets: Ticket[];
}

export default function ProjectTicketsTable({ tickets }: Props) {
  const columns: ColumnDef<Ticket>[] = [
    {
      accessorKey: 'id',
      header: 'ID'
    },
    {
      accessorKey: 'owner_name',
      header: 'Project Owner'
    },
    {
      accessorKey: 'assignee_name',
      header: 'Assign To'
    },
    {
      accessorKey: 'title',
      header: 'Title'
    },
    {
      accessorKey: 'description',
      header: 'Description'
    },
    {
      accessorKey: 'status',
      header: 'Status'
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
            <Button>Delete</Button>
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
