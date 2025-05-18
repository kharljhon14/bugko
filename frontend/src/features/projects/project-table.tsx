import DataTable from '@/components/common/data-table';
import { Button } from '@/components/ui/button';

import type { Project } from '@/types/projects';
import type { ColumnDef } from '@tanstack/react-table';

const columns: ColumnDef<Project>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'owner_name',
    header: 'Project Owner'
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

interface Props {
  projects: Project[];
}
export default function ProjectTable({ projects }: Props) {
  return (
    <div className="p-8">
      <DataTable
        columns={columns}
        data={projects}
      />
    </div>
  );
}
