import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
