import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProjectsState } from './projects.reducer';

export const selectProjectsState = createFeatureSelector<ProjectsState>('projects');

export const selectAllProjects = createSelector(
  selectProjectsState,
  (state) => state.projects
);

export const selectProjectsLoading = createSelector(
  selectProjectsState,
  (state) => state.loading
);

export const selectProjectsError = createSelector(
  selectProjectsState,
  (state) => state.error
);

// 🐛 CHALLENGE 7 (NgRx - Wrong Selector):
// This selector tries to find the selected project but reads
// `selectedProjectId` from the WRONG state slice — it reads from
// IssuesState instead of ProjectsState.
// FIX: Use selectProjectsState for both the ID and the projects list.
export const selectSelectedProject = createSelector(
  selectProjectsState,
  // 🐛 BUG: Reading selectedProjectId but also need projects from same state
  (state) => {
    // This always returns undefined because it compares against issue state
    return state.projects.find(p => p.id === state.selectedProjectId) ?? null;
  }
);

// This selector works correctly — for reference
export const selectActiveProjects = createSelector(
  selectAllProjects,
  (projects) => projects.filter(p => p.status === 'active')
);

export const selectProjectById = (projectId: string) => createSelector(
  selectAllProjects,
  (projects) => projects.find(p => p.id === projectId) ?? null
);
