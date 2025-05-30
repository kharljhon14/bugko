import agent from '@/api/agents';
import { useQuery } from '@tanstack/react-query';
import type { GoogleUser } from '@/types/auth';
import ProjectMembersCard from './project-members-card';
import type { PaginationState } from '@tanstack/react-table';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import type { Project } from '@/types/projects';
import AddMemberForm from './add-member-form';

interface Props {
  user: GoogleUser;
}

export default function MembersContainer({ user }: Props) {
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const [openFormModal, setOpenFormModal] = useState(false);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });

  const { data, isLoading } = useQuery({
    queryKey: ['projects', pagination.pageIndex + 1],
    queryFn: () => agent.projects.getAllProjectByOwner(user.data.user_id, pagination.pageIndex + 1)
  });

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">Loading projects...</div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Project Members</h2>
        <p className="text-sm text-gray-500">Manage team members per project below.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.data.map((project) => (
          <ProjectMembersCard
            key={project.id}
            project={project}
            setSelectedProject={setSelectedProject}
            setOpenFormModal={setOpenFormModal}
          />
        ))}
      </div>

      <Dialog
        open={openFormModal}
        onOpenChange={setOpenFormModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Member to {selectedProject?.name}</DialogTitle>
          </DialogHeader>
          <AddMemberForm
            projectID={selectedProject?.id ?? ''}
            setOpenForm={setOpenFormModal}
          />
        </DialogContent>
      </Dialog>

      {data._metadata.lastPage > 1 && (
        <div className="flex justify-center gap-4 mt-8">
          <Button
            onClick={() => setPagination({ pageIndex: pagination.pageIndex - 1, pageSize: 10 })}
            disabled={pagination.pageIndex + 1 === data._metadata.firstPage}
            variant="outline"
          >
            Previous
          </Button>
          <Button
            onClick={() => setPagination({ pageIndex: pagination.pageIndex + 1, pageSize: 10 })}
            disabled={pagination.pageIndex + 1 === data._metadata.lastPage}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
