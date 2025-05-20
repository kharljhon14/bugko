import DataTable from '@/components/common/data-table';
import { Button } from '@/components/ui/button';

import type { Project } from '@/types/projects';
import type { ColumnDef } from '@tanstack/react-table';
import ProjectDeleteButton from './project-delete-button';

interface Props {
  projects: Project[];
  setSelectedProject: (project: Project) => void;
  setOpenFormModal: (value: boolean) => void;
}

export default function ProjectTable({ projects, setSelectedProject, setOpenFormModal }: Props) {
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
      cell: ({ row }) => {
        return (
          <div className="flex gap-4">
            <Button>View</Button>
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
        columns={columns}
        data={projects}
      />
    </div>
  );
}
