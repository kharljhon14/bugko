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

interface Props {
  projects: Project[];
}

export default function ProjectsContainer({ projects }: Props) {
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const [openFormModal, setOpenFormModal] = useState(false);

  const handleOpenDialog = () => {
    setOpenFormModal(true);
    setSelectedProject(undefined);
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="ml-auto">
          <Dialog
            open={openFormModal}
            onOpenChange={setOpenFormModal}
          >
            <DialogTrigger
              onClick={handleOpenDialog}
              className={buttonVariants({ variant: 'default' })}
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
            projects={projects}
            setSelectedProject={setSelectedProject}
            setOpenFormModal={setOpenFormModal}
          />
        </div>
      </div>
    </>
  );
}
