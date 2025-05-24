import type { Project } from '@/types/projects';
import { create } from 'zustand';

interface State {
  selectedProject: Project | null;
}

interface Action {
  setSelectedProject: (project: State['selectedProject']) => void;
}

export const useProjectStore = create<State & Action>((set) => ({
  selectedProject: null,
  setSelectedProject: (project) => set({ selectedProject: project })
}));
