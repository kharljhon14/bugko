import agent from '@/api/agents';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { addMemberSchema, type AddMemberSchemaType } from '@/schemas/members';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';

interface Props {
  projectID: string;
}

export default function AddMemberForm({ projectID }: Props) {
  const form = useForm<AddMemberSchemaType>({ resolver: zodResolver(addMemberSchema) });

  const addUser = useMutation({
    mutationKey: ['members'],
    mutationFn: ({ projectID, userID }: { projectID: number; userID: number }) =>
      agent.projectMembers.addProjectMember(projectID, userID)
  });

  const { refetch } = useQuery({
    queryKey: ['users'],
    queryFn: () => agent.auth.getUserByEmail(form.getValues('email')),
    enabled: false
  });

  const onSubmit: SubmitHandler<AddMemberSchemaType> = async () => {
    const { data } = await refetch();

    addUser.mutate({ projectID: Number(projectID), userID: Number(data?.data.id) });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-fit">Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter Email"
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
          Submit
        </Button>
      </form>
    </Form>
  );
}
