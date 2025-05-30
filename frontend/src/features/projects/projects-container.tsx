import type { Project } from '@/types/projects';

import ProjectForm from './project-form';
import ProjectTable from './project-table';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { buttonVariants } from '@/components/ui/button';
import agent from '@/api/agents';
import { useQuery } from '@tanstack/react-query';
import type { GoogleUser } from '@/types/auth';
import type { PaginationState } from '@tanstack/react-table';

interface Props {
  user: GoogleUser;
}

export default function ProjectsContainer({ user }: Props) {
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const [openFormModal, setOpenFormModal] = useState(false);

  const handleOpenDialog = () => {
    setOpenFormModal(true);
    setSelectedProject(undefined);
  };

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['projects', pagination.pageIndex + 1],
    queryFn: () => agent.projects.getAllProjectByID(user.data.user_id, pagination.pageIndex + 1)
  });

  if (isError || error) {
    return (
      <div className="text-red-600">
        Oops! We couldn't load your projects. Please try again later.
      </div>
    );
  }

  if (isLoading) {
    return <div>Fetching your projects...</div>;
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col justify-between md:flex-row md:items-center w-full gap-6">
          <div>
            <h1 className="text-2xl font-bold">Hi {user.data.name}, welcome back!</h1>
            <p className="text-gray-600 text-sm">
              Below is a list of your projects. You can create a new one or update an existing
              project anytime.
            </p>
          </div>
          <Dialog
            open={openFormModal}
            onOpenChange={setOpenFormModal}
          >
            <DialogTrigger
              onClick={handleOpenDialog}
              className={buttonVariants({ variant: 'default', size: 'lg' })}
            >
              Create Project
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedProject ? 'Update Project' : 'Create Project'}</DialogTitle>
                <DialogDescription>
                  {selectedProject ? 'Update the project name.' : 'Give your new project a name.'}
                </DialogDescription>
              </DialogHeader>
              <ProjectForm
                selectedProject={selectedProject}
                setOpenFormModal={setOpenFormModal}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="mt-6">
          <ProjectTable
            user={user}
            projects={data?.data ?? []}
            pagination={pagination}
            setPagination={setPagination}
            totalPage={data?._metadata.lastPage ?? 1}
            setSelectedProject={setSelectedProject}
            setOpenFormModal={setOpenFormModal}
          />
        </div>
      </div>
    </>
  );
}
