import agent from '@/api/agents';
import { useQuery } from '@tanstack/react-query';
import type { PaginationState } from '@tanstack/react-table';
import { useState } from 'react';
import MembersProjectsTable from './members-projects-table';
import type { GoogleUser } from '@/types/auth';

interface Props {
  user: GoogleUser;
}

export default function MembersContainer({ user }: Props) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });

  const { data, isLoading } = useQuery({
    queryKey: ['projects', pagination.pageIndex + 1],
    queryFn: () => agent.projects.getAllProjectByOwner(user.data.user_id, pagination.pageIndex + 1)
  });

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">Loading ticket...</div>
    );
  }
  return (
    <MembersProjectsTable
      projects={data.data}
      pagination={pagination}
      setPagination={setPagination}
      totalPage={data._metadata.lastPage}
    />
  );
}
