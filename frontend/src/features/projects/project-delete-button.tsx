import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogHeader
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import type { Project } from '@/types/projects';
import { DialogClose } from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import agent from '@/api/agents';

interface Props {
  project: Project;
}

export default function ProjectDeleteButton({ project }: Props) {
  const queryClient = useQueryClient();

  const deleteProject = useMutation({
    mutationKey: ['projects'],
    mutationFn: ({ id }: { id: string }) => agent.projects.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  const handleDeleteProject = () => {
    deleteProject.mutate({ id: project.id });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete {project.name}?</DialogTitle>
          <DialogDescription>There's no coming back if you delete this.</DialogDescription>
        </DialogHeader>
        <div className="flex justify-between mt-6">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleDeleteProject}
            type="button"
            variant="destructive"
          >
            Delete Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
