import MembersContainer from '@/features/members/members-container';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/members')({
  component: RouteComponent
});

function RouteComponent() {
  const user = useLoaderData({ from: '/_authenticated' });

  return <MembersContainer user={user} />;
}
