import agent from '@/api/agents';
import AppProviders from '@/providers/providers';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

// src/routes/_authenticated.tsx
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    try {
      await agent.auth.me();
    } catch {
      throw redirect({ to: '/auth' });
    }
  },
  loader: async () => {
    // Fetch and cache user info in React Query store
    return await agent.auth.me();
  },
  component: () => (
    <>
      <div className="p-8 flex flex-col">
        <AppProviders>
          <Outlet />
        </AppProviders>
      </div>
      <TanStackRouterDevtools />
    </>
  )
});
