import type { ProjectSchemaType } from '@/schemas/projects';
import type { TicketSchemaType } from '@/schemas/tickets';
import type { GoogleUser } from '@/types/auth';
import type { ProjectMember } from '@/types/project-members';
import type { Project } from '@/types/projects';
import type { GenericResponse, GenericResponseArray } from '@/types/response';
import type { TicketRequest, Ticket, TicketWithProjectName } from '@/types/tickets';

import axios, { type AxiosResponse } from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

const responseBody = <T>(res: AxiosResponse<T>) => res.data;

const requests = {
  get: <T>(url: string) => axios.get(url).then(responseBody<T>),
  post: <T, D>(url: string, body: D) => axios.post(url, body).then(responseBody<T>),
  patch: <T, D>(url: string, body: D) => axios.patch(url, body).then(responseBody<T>),
  delete: <T>(url: string) => axios.delete(url).then(responseBody<T>)
};

const auth = {
  me: () => requests.get<GoogleUser>('/me'),
  getUserByEmail: (email: string) => requests.get<GoogleUser>(`/get-user?email=${email}`),
  logout: () => requests.get('/logout')
};

const projects = {
  getAllProjectByOwner: (ownerID: string, page: number) =>
    requests.get<GenericResponseArray<Project>>(`/projects?owner_id=${ownerID}&page=${page}`),
  getAllProjectByID: (userID: string, page: number) =>
    requests.get<GenericResponseArray<Project>>(`/projects/users?user_id=${userID}&page=${page}`),
  getProjectByID: (projectID: string) =>
    requests.get<GenericResponse<Project>>(`/projects/${projectID}`),
  createProject: (body: ProjectSchemaType) => requests.post('/projects', body),
  updateProject: (id: string, body: ProjectSchemaType) => requests.patch(`/projects/${id}`, body),
  deleteProject: (id: string) => requests.delete(`/projects/${id}`)
};

const projectMembers = {
  getAllProjectMember: (projectID: string) =>
    requests.get<GenericResponseArray<ProjectMember>>(
      `project-members/members?project_id=${projectID}`
    ),
  addProjectMember: (projectID: number, userID: number) =>
    requests.post('/project-members', { project_id: projectID, user_id: userID }),
  removeProjectMember: (projectID: number, userID: number) =>
    requests.delete(`/project-members?project_id=${projectID}&user_id=${userID}`)
};

const tickets = {
  getAllTicketByProject: (projectID: string, page: number) =>
    requests.get<GenericResponseArray<Ticket>>(`/tickets?project_id=${projectID}&page=${page}`),
  getAllTicketByAssignee: (page: number) =>
    requests.get<GenericResponseArray<TicketWithProjectName>>(`/tickets/user?page=${page}`),
  getTicketByID: (ticketID: string) =>
    requests.get<GenericResponse<Ticket>>(`/tickets/${ticketID}`),
  createTicket: (body: TicketRequest) =>
    requests.post<GenericResponse<Ticket>, TicketSchemaType>('/tickets', body),
  updateTicket: (id: string, body: TicketSchemaType) =>
    requests.patch<GenericResponse<Ticket>, TicketSchemaType>(`/tickets/${id}`, body),
  deleteTicket: (id: string) => requests.delete(`/tickets/${id}`)
};

const agent = {
  auth,
  projects,
  projectMembers,
  tickets
};

export default agent;
