import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { Home, Inbox } from 'lucide-react';
import { Button } from '../ui/button';
import { useMutation } from '@tanstack/react-query';
import agent from '@/api/agents';
import { useRouter } from '@tanstack/react-router';

// Menu items.
const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home
  },
  {
    title: 'Projects',
    url: '/projects',
    icon: Inbox
  }
];

export function AppSidebar() {
  const router = useRouter();

  const logout = useMutation({
    mutationKey: ['user'],
    mutationFn: agent.auth.logout,
    onSuccess: () => {
      router.navigate({ to: '/auth' });
    }
  });

  return (
    <Sidebar defaultChecked>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>BugKo</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button onClick={() => logout.mutate()}>Logout</Button>
      </SidebarFooter>
    </Sidebar>
  );
}
