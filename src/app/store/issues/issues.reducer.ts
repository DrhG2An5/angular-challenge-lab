import { createReducer, on } from '@ngrx/store';
import { Issue } from '../../core/models';
import { IssueActions } from './issues.actions';

export interface IssuesState {
  issues: Issue[];
  searchResults: Issue[];
  selectedIssueId: string | null;
  loading: boolean;
  searching: boolean;
  error: string | null;
}

export const initialIssuesState: IssuesState = {
  issues: [],
  searchResults: [],
  selectedIssueId: null,
  loading: false,
  searching: false,
  error: null,
};

export const issuesReducer = createReducer(
  initialIssuesState,

  on(IssueActions.loadIssues, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(IssueActions.loadIssuesSuccess, (state, { issues }) => ({
    ...state,
    issues,
    loading: false,
  })),

  on(IssueActions.loadIssuesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(IssueActions.loadIssuesByProjectSuccess, (state, { issues }) => ({
    ...state,
    issues,
    loading: false,
  })),

  on(IssueActions.createIssueSuccess, (state, { issue }) => ({
    ...state,
    issues: [...state.issues, issue],
  })),

  on(IssueActions.selectIssue, (state, { issueId }) => ({
    ...state,
    selectedIssueId: issueId,
  })),

  on(IssueActions.searchIssues, (state) => ({
    ...state,
    searching: true,
  })),

  on(IssueActions.searchIssuesSuccess, (state, { issues }) => ({
    ...state,
    searchResults: issues,
    searching: false,
  })),

  on(IssueActions.searchIssuesFailure, (state, { error }) => ({
    ...state,
    searching: false,
    error,
  })),
);
