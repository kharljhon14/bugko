import DataTable from '@/components/common/data-table';
import { buttonVariants } from '@/components/ui/button';
import type { Project } from '@/types/projects';
import type { ColumnDef, OnChangeFn, PaginationState } from '@tanstack/react-table';
import { Link } from '@tanstack/react-router';
import { Minus, Plus } from 'lucide-react';

interface Props {
  projects: Project[];
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  totalPage: number;
}

export default function MembersProjectsTable({
  projects,
  pagination,
  setPagination,
  totalPage
}: Props) {
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
      accessorKey: 'name',
      header: '# Members'
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
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <div className="flex gap-4">
            <Link
              className={buttonVariants({ variant: 'default' })}
              to="/projects/$projectId"
              params={{ projectId: row.original.id }}
            >
              <Plus /> / <Minus /> Members
            </Link>
          </div>
        );
      }
    }
  ];

  return (
    <div>
      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        totalPage={totalPage}
        columns={columns}
        data={projects}
      />
    </div>
  );
}
