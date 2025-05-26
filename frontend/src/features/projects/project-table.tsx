import DataTable from '@/components/common/data-table';
import { Button, buttonVariants } from '@/components/ui/button';

import type { Project } from '@/types/projects';
import type { ColumnDef, OnChangeFn, PaginationState } from '@tanstack/react-table';
import ProjectDeleteButton from './project-delete-button';
import { Link } from '@tanstack/react-router';
import { ArrowUpDown } from 'lucide-react';

interface Props {
  projects: Project[];
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  totalPage: number;
  setSelectedProject: (project: Project) => void;
  setOpenFormModal: (value: boolean) => void;
}

export default function ProjectTable({
  projects,
  pagination,
  setPagination,
  totalPage,
  setSelectedProject,
  setOpenFormModal
}: Props) {
  const handleUpdateProject = (data: Project) => {
    setSelectedProject(data);
    setOpenFormModal(true);
  };

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: 'id',
      header: 'ID'
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
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
            Project Owner
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
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
            <Link
              className={buttonVariants({ variant: 'default' })}
              to="/projects/$projectId"
              params={{ projectId: row.original.id }}
            >
              View
            </Link>
            <Button
              onClick={() => handleUpdateProject(row.original)}
              variant="outline"
            >
              Update
            </Button>
            <ProjectDeleteButton project={row.original} />
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
