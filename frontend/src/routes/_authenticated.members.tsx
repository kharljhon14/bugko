import MembersContainer from '@/features/members/members-container';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/members')({
  component: RouteComponent
});

function RouteComponent() {
  return <MembersContainer />;
}
