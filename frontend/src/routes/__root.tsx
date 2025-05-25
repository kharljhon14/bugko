import { createRootRoute, Outlet } from '@tanstack/react-router';
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import '../index.css';
import AppProviders from '@/providers/providers';

export const Route = createRootRoute({
  component: () => (
    <>
      <AppProviders>
        <Outlet />
      </AppProviders>
      {/* <TanStackRouterDevtools /> */}
    </>
  )
});
