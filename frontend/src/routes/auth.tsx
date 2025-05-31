import agent from '@/api/agents';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/auth')({
  beforeLoad: async () => {
    try {
      await agent.auth.me();

      return redirect({ to: '/' });
    } catch {
      // throw redirect({ to: '/auth' });
    }
  },
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm shadow-2xl rounded-2xl border border-slate-200 bg-white">
        <CardHeader className="text-center p-6 border-b">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-800">Welcome to BugKo</h1>
            <p className="text-sm text-slate-500">Sign in to manage your tickets</p>
          </div>
        </CardHeader>

        <CardContent className="p-6 flex flex-col items-center space-y-4">
          <Button
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition"
            onClick={() => (window.location.href = 'http://localhost:8080/login/google')}
          >
            Continue with Google
          </Button>

          {/* Optional: Uncomment to support more providers */}
          {/* <Button
            size="lg"
            variant="outline"
            className="w-full"
          >
            Continue with GitHub
          </Button> */}
        </CardContent>
      </Card>
    </div>
  );
}
