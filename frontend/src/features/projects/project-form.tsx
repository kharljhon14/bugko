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

interface Props {
  selectedProject: Project | undefined;
}

export default function ProjectForm({ selectedProject }: Props) {
  const form = useForm<ProjectSchemaType>({
    resolver: zodResolver(projectSchema)
  });

  const onSubmit: SubmitHandler<ProjectSchemaType> = (data) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="project_name"
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
