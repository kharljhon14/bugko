import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export default function ProjectForm() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Create New Project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>Give your new project a name.</DialogDescription>
        </DialogHeader>
        <form>
          <Input placeholder="Project Name" />
          <Button className="w-full mt-4">Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
