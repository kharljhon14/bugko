import agent from '@/api/agents';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';

import type { ProjectMember } from '@/types/project-members';
import { DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Minus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
  selectedUser: ProjectMember;
  projectID: string;
}

export default function RemoveMemberButton({ selectedUser, projectID }: Props) {
  const queryClient = useQueryClient();
  const [openFormModal, setOpenFormModal] = useState(false);

  const removeUser = useMutation({
    mutationKey: ['members', projectID],
    mutationFn: () =>
      agent.projectMembers.removeProjectMember(Number(projectID), Number(selectedUser.id)),
    onSuccess: () => {
      toast.success('User has been removed', { richColors: true });
      queryClient.invalidateQueries({ queryKey: ['members', projectID] });
      setOpenFormModal(false);
    }
  });

  return (
    <Dialog
      open={openFormModal}
      onOpenChange={setOpenFormModal}
    >
      <DialogTrigger onClick={() => setOpenFormModal(true)}>
        <Button
          asChild
          variant="ghost"
          className="hover:bg-gray-200 hover:text-destructive"
          size="icon"
        >
          <Minus className="text-destructive" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to remove {selectedUser?.name}?</DialogTitle>
        </DialogHeader>
        <div className="mt-6 flex justify-between">
          <Button onClick={() => setOpenFormModal(false)}>Cancel</Button>
          <Button
            onClick={() => removeUser.mutate()}
            variant="destructive"
          >
            Remove
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
