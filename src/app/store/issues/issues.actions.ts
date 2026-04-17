import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Issue, CreateIssuePayload } from '../../core/models';

export const IssueActions = createActionGroup({
  source: 'Issues',
  events: {
    'Load Issues': emptyProps(),
    'Load Issues Success': props<{ issues: Issue[] }>(),
    'Load Issues Failure': props<{ error: string }>(),
    'Load Issues By Project': props<{ projectId: string }>(),
    'Load Issues By Project Success': props<{ issues: Issue[] }>(),
    'Create Issue': props<{ payload: CreateIssuePayload }>(),
    'Create Issue Success': props<{ issue: Issue }>(),
    'Create Issue Failure': props<{ error: string }>(),
    'Select Issue': props<{ issueId: string }>(),
    'Search Issues': props<{ query: string }>(),
    'Search Issues Success': props<{ issues: Issue[] }>(),
    'Search Issues Failure': props<{ error: string }>(),
  },
});
