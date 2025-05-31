import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { FolderKanban, Home, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { useMutation } from '@tanstack/react-query';
import agent from '@/api/agents';
import { useLoaderData, useRouter } from '@tanstack/react-router';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home
  },
  {
    title: 'Projects',
    url: '/projects',
    icon: FolderKanban
  },
  {
    title: 'Members',
    url: '/members',
    icon: Users
  }
];

export function AppSidebar() {
  const user = useLoaderData({ from: '/_authenticated' });

  const router = useRouter();

  const logout = useMutation({
    mutationKey: ['user'],
    mutationFn: agent.auth.logout,
    onSuccess: () => {
      router.navigate({ to: '/auth' });
    }
  });

  return (
    <Sidebar
      defaultChecked
      className="bg-white border-r w-64 flex flex-col"
    >
      <SidebarContent className="flex-1 flex flex-col">
        <SidebarGroup>
          {/* User Info Section */}
          <div className="flex items-center gap-3 px-4 py-2 border-b">
            <Avatar>
              <AvatarImage src={user.data.picture} />
              <AvatarFallback>
                {user.data?.given_name[0]}
                {user.data.family_name?.length > 0 && user.data.family_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-gray-800">{user.data.name}</p>
              <p className="text-xs text-gray-500">{user.data.email}</p>
            </div>
          </div>

          {/* Menu */}
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition rounded"
                    >
                      <item.icon className="w-5 h-5 text-gray-700" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <Button
          onClick={() => logout.mutate()}
          className="w-full text-sm bg-red-500 hover:bg-red-600 text-white"
        >
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
