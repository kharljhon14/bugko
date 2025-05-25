import agent from '@/api/agents';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { ticketSchema, type TicketSchemaType } from '@/schemas/tickets';
import type { TicketRequest, Ticket } from '@/types/tickets';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

import { useForm, type SubmitHandler } from 'react-hook-form';

interface Props {
  projectID: string;
  selectedTicket?: Ticket;
  setOpenFormModal: (value: boolean) => void;
}

export default function TicketForm({ projectID, selectedTicket, setOpenFormModal }: Props) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const form = useForm({ resolver: zodResolver(ticketSchema) });

  const { data, isLoading } = useQuery({
    queryKey: ['project-members'],
    queryFn: () => agent.projectMembers.getAllProjectMember(projectID)
  });

  const createTicket = useMutation({
    mutationKey: ['tickets'],
    mutationFn: (data: TicketRequest) => agent.tickets.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setOpenFormModal(false);
    }
  });

  const updateTicket = useMutation({
    mutationKey: ['tickets', selectedTicket?.id],
    mutationFn: ({ id, data }: { id: string; data: TicketSchemaType }) =>
      agent.tickets.updateTicket(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setOpenFormModal(false);
    }
  });

  const onSubmit: SubmitHandler<TicketSchemaType> = (data) => {
    if (selectedTicket) {
      updateTicket.mutate({ id: selectedTicket.id, data: data });
    } else {
      createTicket.mutate({ project_id: Number(projectID), ...data });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          defaultValue={selectedTicket?.title}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-fit">Title*</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter Title"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          defaultValue={selectedTicket?.description ?? ''}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-fit">Description</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none h-52"
                  {...field}
                  placeholder="Enter Description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assignee_id"
          defaultValue={
            selectedTicket?.assignee_id ? Number(selectedTicket?.assignee_id) : undefined
          }
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-fit">Assign To</FormLabel>

              <Popover
                open={open}
                onOpenChange={setOpen}
              >
                <PopoverTrigger
                  disabled={isLoading}
                  asChild
                >
                  <FormControl>
                    <Button
                      variant="outline"
                      type="button"
                      role="combobox"
                      className={cn(
                        'w-full justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? data?.data.find((u) => Number(u.id) === field.value)?.name
                        : 'Select User'}

                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className={cn(' w-full p-0')}>
                  <Command>
                    <CommandInput
                      placeholder="Search user"
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No Users found.</CommandEmpty>
                      <CommandGroup>
                        {data?.data.map((u) => (
                          <CommandItem
                            value={u.id}
                            key={u.id}
                            onSelect={() => {
                              form.setValue('assignee_id', Number(u.id));
                              setOpen(false);
                            }}
                          >
                            {u.name}
                            <Check
                              className={cn(
                                'ml-auto',
                                Number(u.id) === field.value ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 w-full">
          <FormField
            control={form.control}
            name="status"
            defaultValue={selectedTicket?.status}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="w-fit">Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            defaultValue={selectedTicket?.priority}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="w-fit">Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

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
