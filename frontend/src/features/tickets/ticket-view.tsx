import agent from '@/api/agents';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@/components/ui/breadcrumb';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';
import TicketForm from './ticket-form';

import { useState } from 'react';
import { renderPriority, renderStatus } from '@/utils/renderers';
import TicketDeleteButton from './ticket-delete-button';

interface Props {
  ticketId: string;
}

export default function TicketView({ ticketId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['tickets', ticketId],
    queryFn: () => agent.tickets.getTicketByID(ticketId)
  });

  const projectQuery = useQuery({
    queryKey: ['project'],
    queryFn: () => agent.projects.getProjectByID(data?.data.project_id.toString() ?? ''),
    enabled: !!data?.data.project_id
  });

  const [openFormModal, setOpenFormModal] = useState(false);

  const handleOpenDialog = () => {
    setOpenFormModal(true);
  };

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">Loading ticket...</div>
    );
  }

  return (
    <div className="">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex space-x-4">
          <Button
            variant="outline"
            size="icon"
            asChild
          >
            <Link
              to="/projects/$projectId"
              params={{ projectId: data.data.project_id.toString() }}
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>

          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">{data.data.title}</h1>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/projects/${data.data.project_id}`}>
                    {projectQuery.data?.data.name ?? 'Loading...'}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{data.data.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog
            open={openFormModal}
            onOpenChange={setOpenFormModal}
          >
            <DialogTrigger
              onClick={handleOpenDialog}
              className={buttonVariants({ variant: 'default' })}
            >
              Update Ticket
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Ticket</DialogTitle>
              </DialogHeader>
              <TicketForm
                projectID={data.data.project_id}
                selectedTicket={data.data}
                setOpenFormModal={setOpenFormModal}
              />
            </DialogContent>
          </Dialog>
          <TicketDeleteButton
            ticket={data.data}
            redirect
          />
        </div>
      </div>

      <Card className="shadow-lg border border-gray-200 rounded-lg overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-semibold text-gray-900 mb-1">
            {data.data.title}
          </CardTitle>
          <CardDescription>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <span className="font-semibold text-gray-700">Owner:</span> {data.data.owner_name}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Assignee:</span>{' '}
                {data.data.assignee_name}
              </p>

              {/* Priority and Status Container */}
              <div className="flex flex-wrap gap-3 items-center mt-1">
                {/* Priority */}
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-700 uppercase tracking-wide text-xs">
                    Priority:
                  </span>
                  {renderPriority(data.data.priority)}
                </div>

                {/* Status */}
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-700 uppercase tracking-wide text-xs">
                    Status:
                  </span>
                  {renderStatus(data.data.status)}
                </div>
              </div>
            </div>
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-3">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {data.data.description}
          </p>
        </CardContent>

        <CardFooter className="pt-4 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-500">
            <p>Created: {new Date(data.data.created_at).toLocaleString()}</p>
            <span className="hidden sm:inline">•</span>
            <p>Updated: {new Date(data.data.updated_at).toLocaleString()}</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
