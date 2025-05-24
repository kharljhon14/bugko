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
import { createTicketSchema, type CreateTicketSchemaType } from '@/schemas/tickets';
import { zodResolver } from '@hookform/resolvers/zod';

import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

import { useForm, type SubmitHandler } from 'react-hook-form';

const users = [
  { label: 'Kharl', value: '1' },
  { label: 'Kharl2', value: '2' },
  { label: 'Kharl3', value: '3' }
] as const;

export default function TicketForm() {
  const [open, setOpen] = useState(false);
  const form = useForm({ resolver: zodResolver(createTicketSchema) });

  const onSubmit: SubmitHandler<CreateTicketSchemaType> = (data) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" flex flex-col gap-4"
      >
        <FormField
          control={form.control}
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
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assignee_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-fit">Assign To</FormLabel>

              <Popover
                open={open}
                onOpenChange={setOpen}
              >
                <PopoverTrigger asChild>
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
                        ? users.find((u) => u.value === field.value)?.label
                        : 'Select user'}
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
                        {users.map((u) => (
                          <CommandItem
                            value={u.label}
                            key={u.value}
                            onSelect={() => {
                              form.setValue('assignee_id', u.value);
                              setOpen(false);
                            }}
                          >
                            {u.label}
                            <Check
                              className={cn(
                                'ml-auto',
                                u.value === field.value ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />

        <div className="flex gap-4 w-full">
          <FormField
            control={form.control}
            name="status"
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
