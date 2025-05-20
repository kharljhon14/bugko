import type { ProjectSchemaType } from '@/schemas/projects';
import type { GoogleUser } from '@/types/auth';
import type { GetAllProjectResponse } from '@/types/projects';
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
  logout: () => requests.get('/logout')
};

const projects = {
  getAllProjectByOwner: (ownerID: string) =>
    requests.get<GetAllProjectResponse>(`/projects?owner_id=${ownerID}`),
  createProject: (body: ProjectSchemaType) => requests.post('/projects', body),
  updateProject: (id: string, body: ProjectSchemaType) => requests.patch(`projects/${id}`, body)
};

const agent = {
  auth,
  projects
};

export default agent;
