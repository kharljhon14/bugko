export interface Project {
  id: string;
  name: string;
  owner: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectResponse {
  data: Project[];
}
