import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IssuesState } from './issues.reducer';

export const selectIssuesState = createFeatureSelector<IssuesState>('issues');

export const selectAllIssues = createSelector(
  selectIssuesState,
  (state) => state.issues
);

export const selectIssuesLoading = createSelector(
  selectIssuesState,
  (state) => state.loading
);

export const selectSearchResults = createSelector(
  selectIssuesState,
  (state) => state.searchResults
);

export const selectIsSearching = createSelector(
  selectIssuesState,
  (state) => state.searching
);

export const selectSelectedIssue = createSelector(
  selectIssuesState,
  (state) => state.issues.find(i => i.id === state.selectedIssueId) ?? null
);

export const selectIssuesByPriority = (priority: string) => createSelector(
  selectAllIssues,
  (issues) => issues.filter(i => i.priority === priority)
);

export const selectIssueCountByStatus = createSelector(
  selectAllIssues,
  (issues) => {
    return {
      open: issues.filter(i => i.status === 'open').length,
      'in-progress': issues.filter(i => i.status === 'in-progress').length,
      'in-review': issues.filter(i => i.status === 'in-review').length,
      done: issues.filter(i => i.status === 'done').length,
      closed: issues.filter(i => i.status === 'closed').length,
    };
  }
);
