import { createReducer, on } from '@ngrx/store';
import { Project } from '../../core/models';
import { ProjectActions } from './projects.actions';

export interface ProjectsState {
  projects: Project[];
  selectedProjectId: string | null;
  loading: boolean;
  error: string | null;
}

export const initialProjectsState: ProjectsState = {
  projects: [],
  selectedProjectId: null,
  loading: false,
  error: null,
};

export const projectsReducer = createReducer(
  initialProjectsState,

  on(ProjectActions.loadProjects, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProjectActions.loadProjectsSuccess, (state, { projects }) => ({
    ...state,
    projects,
    loading: false,
  })),

  on(ProjectActions.loadProjectsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // 🐛 CHALLENGE 8 (NgRx - State Mutation):
  // This handler MUTATES the state directly by pushing to the array
  // instead of creating a new array. NgRx requires immutable updates.
  // With OnPush change detection, the UI won't reflect the new project.
  // FIX: Use spread operator to create a new array: [...state.projects, project]
  on(ProjectActions.createProjectSuccess, (state, { project }) => {
    state.projects.push(project);  // 🐛 MUTATION!
    return state;                   // 🐛 Returns same reference!
  }),

  on(ProjectActions.selectProject, (state, { projectId }) => ({
    ...state,
    selectedProjectId: projectId,
  })),

  // 🐛 CHALLENGE 9 (NgRx - Wrong state update):
  // This handler updates status but uses the wrong type — `status` is typed as
  // string but ProjectStatus is a union type. Also, it mutates the project object
  // directly instead of mapping to a new array.
  on(ProjectActions.updateProjectStatus, (state, { projectId, status }) => {
    const project = state.projects.find(p => p.id === projectId);
    if (project) {
      project.status = status as any; // 🐛 Direct mutation of nested object
    }
    return { ...state }; // 🐛 Shallow copy doesn't help — projects array refs unchanged
  }),
);
