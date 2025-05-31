import agent from '@/api/agents';
import { AppSidebar } from '@/components/common/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppProviders from '@/providers/providers';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

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
    <SidebarProvider>
      <AppSidebar />
      <div className=" min-h-screen w-screen bg-slate-50">
        {/* Main Content */}
        <div className=" flex-col">
          {/* Header */}
          <header className=" flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
            <SidebarTrigger />
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              BugKo Ticketing System
            </h1>
          </header>

          {/* Page Content */}
          <main className=" p-6 overflow-auto">
            <AppProviders>
              <Outlet />
            </AppProviders>
          </main>
        </div>
      </div>

      {/* <TanStackRouterDevtools /> */}
    </SidebarProvider>
  )
});
