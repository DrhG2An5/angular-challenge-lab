import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { ApiService } from '../../core/services/api.service';
import { IssueActions } from './issues.actions';

@Injectable()
export class IssuesEffects {
  constructor(
    private actions$: Actions,
    private apiService: ApiService
  ) {}

  loadIssues$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IssueActions.loadIssues),
      mergeMap(() =>
        this.apiService.getIssues().pipe(
          map(issues => IssueActions.loadIssuesSuccess({ issues })),
          catchError(error => of(IssueActions.loadIssuesFailure({ error: error.message })))
        )
      )
    )
  );

  loadIssuesByProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IssueActions.loadIssuesByProject),
      mergeMap(({ projectId }) =>
        this.apiService.getIssuesByProject(projectId).pipe(
          map(issues => IssueActions.loadIssuesByProjectSuccess({ issues })),
          catchError(error => of(IssueActions.loadIssuesFailure({ error: error.message })))
        )
      )
    )
  );

  // 🐛 CHALLENGE 11 (RxJS - Race Condition in Effect):
  // Search uses mergeMap, which means rapid typing dispatches multiple
  // concurrent search requests. Older results can arrive AFTER newer ones,
  // showing stale results. Should use switchMap to cancel previous searches.
  searchIssues$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IssueActions.searchIssues),
      mergeMap(({ query }) =>  // 🐛 BUG: should be switchMap
        this.apiService.searchIssues(query).pipe(
          map(issues => IssueActions.searchIssuesSuccess({ issues })),
          catchError(error => of(IssueActions.searchIssuesFailure({ error: error.message })))
        )
      )
    )
  );

  createIssue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IssueActions.createIssue),
      mergeMap(({ payload }) =>
        this.apiService.createIssue(payload).pipe(
          map(issue => IssueActions.createIssueSuccess({ issue })),
          catchError(error => of(IssueActions.createIssueFailure({ error: error.message })))
        )
      )
    )
  );
}
