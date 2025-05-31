import agent from '@/api/agents';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import type { GoogleUser } from '@/types/auth';
import type { ResponseError } from '@/types/errors';
import type { ProjectMember } from '@/types/project-members';
import type { GenericResponse } from '@/types/response';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { AlertCircle } from 'lucide-react';
import { useState, type Dispatch, type SetStateAction } from 'react';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';

interface Props {
  projectID: string;
  setOpenForm: Dispatch<SetStateAction<boolean>>;
}

export default function AddMemberForm({ projectID, setOpenForm }: Props) {
  const queryClient = useQueryClient();

  const [error, setError] = useState<string | undefined>('');
  const form = useForm<AddMemberSchemaType>({ resolver: zodResolver(addMemberSchema) });

  const addUser = useMutation<
    GenericResponse<ProjectMember>,
    AxiosError<ResponseError>,
    { projectID: number; userID: number }
  >({
    mutationKey: ['members'],
    mutationFn: ({ projectID, userID }) => agent.projectMembers.addProjectMember(projectID, userID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', projectID] });
      toast.success('User has been added', { richColors: true });
      setOpenForm(false);
    },
    onError: (error) => {
      setError(error.response?.data.error);
    }
  });

  const { refetch, isRefetching } = useQuery<GoogleUser, AxiosError<ResponseError>>({
    queryKey: ['users'],
    queryFn: () => agent.auth.getUserByEmail(form.getValues('email')),
    enabled: false,
    retry: 0
  });

  const onSubmit: SubmitHandler<AddMemberSchemaType> = async () => {
    setError('');
    const { data, error, isError } = await refetch();

    if (error || isError) {
      setError(error.response?.data.error);
      return;
    }

    addUser.mutate({ projectID: Number(projectID), userID: Number(data?.data.id) });
  };

  return (
    <>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
            disabled={isRefetching || addUser.isPending}
            type="submit"
            className="w-full mt-4"
          >
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}
