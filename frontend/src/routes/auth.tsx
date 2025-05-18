import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm shadow-xl rounded-2xl">
        <CardHeader className="text-center text-xl font-semibold border-b p-4">
          Login to BugKo
        </CardHeader>
        <CardContent className="p-6 flex flex-col items-center space-y-4">
          <Button
            size="lg"
            className="w-full"
            onClick={() => (window.location.href = 'http://localhost:8080/login/google')}
          >
            Continue with Google
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full"
          >
            Continue with Github
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
