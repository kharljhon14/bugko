import { Badge } from '@/components/ui/badge';
import type { Priority, Status } from '@/types/tickets';
import { Flame } from 'lucide-react';

export function renderPriority(priority: Priority) {
  switch (priority) {
    case 'low':
      return (
        <div className="flex">
          <Flame className=" text-red-600" />
          <Flame className=" text-gray-800" />
          <Flame className=" text-gray-800" />
        </div>
      );
    case 'medium':
      return (
        <div className="flex">
          <Flame className=" text-red-600" />
          <Flame className=" text-red-600" />
          <Flame className=" text-gray-800" />
        </div>
      );
    case 'high':
      return (
        <div className="flex">
          <Flame className=" text-red-600" />
          <Flame className=" text-red-600" />
          <Flame className=" text-red-600" />
        </div>
      );
  }
}

export function renderStatus(status: Status) {
  switch (status) {
    case 'open':
      return <Badge className="bg-green-600">Open</Badge>;
    case 'in_progress':
      return <Badge>In Progress</Badge>;
    case 'closed':
      return <Badge className="bg-gray-700">Closed</Badge>;
  }
}
