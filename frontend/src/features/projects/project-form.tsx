import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import type { Project } from '@/types/projects';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, type ProjectSchemaType } from '@/schemas/projects';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import agent from '@/api/agents';

interface Props {
  selectedProject: Project | undefined;
  setOpenFormModal: (value: boolean) => void;
}

export default function ProjectForm({ selectedProject, setOpenFormModal }: Props) {
  const queryClient = useQueryClient();

  const form = useForm<ProjectSchemaType>({
    resolver: zodResolver(projectSchema)
  });

  const createProject = useMutation({
    mutationKey: ['projects'],
    mutationFn: agent.projects.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setOpenFormModal(false);
    }
  });

  const updateProject = useMutation({
    mutationKey: ['projects'],
    mutationFn: ({ id, body }: { id: string; body: ProjectSchemaType }) =>
      agent.projects.updateProject(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setOpenFormModal(false);
    }
  });

  const onSubmit: SubmitHandler<ProjectSchemaType> = (data) => {
    if (selectedProject) {
      updateProject.mutate({ id: selectedProject.id, body: data });
    } else {
      createProject.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          defaultValue={selectedProject?.name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Project Name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full mt-4"
        >
          {selectedProject ? 'Update' : 'Create'}
        </Button>
      </form>
    </Form>
  );
}
