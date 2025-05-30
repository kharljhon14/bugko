export type Status = 'open' | 'in_progress' | 'closed';
export type Priority = 'low' | 'medium' | 'high';

export interface DBTicket {
  id: string;
  project_id: string;
  owner_id: string;
  owner_name: string;
  assignee_id?: string;
  assignee_name?: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  created_at: string;
  updated_at: string;
}
