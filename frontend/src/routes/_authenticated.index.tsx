import agent from '@/api/agents';
import ProjectsContainer from '@/features/projects/projects-container';
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <ProjectsContainer projects={data?.data ?? []} />;
}
