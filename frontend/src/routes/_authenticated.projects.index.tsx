import ProjectsContainer from '@/features/projects/projects-container';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/projects/')({
  component: RouteComponent
});

function RouteComponent() {
  const user = useLoaderData({ from: '/_authenticated' });

  return <ProjectsContainer user={user} />;
}
