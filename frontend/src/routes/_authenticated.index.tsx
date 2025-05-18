import agent from '@/api/agents';
import ProjectForm from '@/features/projects/project-form';
import ProjectTable from '@/features/projects/project-table';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/')({
  component: RouteComponent
});

function RouteComponent() {
  const user = useLoaderData({ from: '/_authenticated' });

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => agent.projects.getAllProjectByOwner(user.data.user_id)
  });

  if (isError || error) {
    return <div>Something went wrong!</div>;
  }

  return (
    <div className="p-8 flex flex-col">
      <div className="ml-auto">
        <ProjectForm />
      </div>
      <div className="mt-6">
        {isLoading ? 'Loading...' : <ProjectTable projects={data?.data ?? []} />}
      </div>
    </div>
  );
}
