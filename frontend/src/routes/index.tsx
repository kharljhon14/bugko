import agent from '@/api/agents';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index
});

function Index() {
  const query = useQuery({
    queryKey: ['user'],
    queryFn: agent.auth.me,
    enabled: false,
    retry: false
  });

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <Button onClick={() => query.refetch()}>Hello</Button>
    </div>
  );
}
