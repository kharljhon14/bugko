import agent from '@/api/agents';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Project } from '@/types/projects';
import { useQuery } from '@tanstack/react-query';
import { Minus, Plus } from 'lucide-react';

interface Props {
  project: Project;
  setSelectedProject: (project: Project) => void;
  setOpenFormModal: (value: boolean) => void;
}

export default function ProjectMembersCard({
  project,
  setSelectedProject,
  setOpenFormModal
}: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['members'],
    queryFn: () => agent.projectMembers.getAllProjectMember(project.id)
  });

  if (isLoading || !data) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <CardTitle className="text-gray-400">Loading {project.name}...</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-400">Fetching members...</CardContent>
      </Card>
    );
  }

  const handleAddMember = () => {
    setSelectedProject(project);
    setOpenFormModal(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">{project.name}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {data.data.length > 0 ? (
          data.data.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 bg-gray-100 rounded"
            >
              <div>
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              {user.id !== project.owner_id && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-red-500 hover:bg-red-100"
                >
                  <Minus className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No members yet.</p>
        )}
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button onClick={handleAddMember}>
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </CardFooter>
    </Card>
  );
}
