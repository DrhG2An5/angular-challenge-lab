import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap } from 'rxjs/operators';
import { ApiService } from '../../core/services/api.service';
import { ProjectActions } from './projects.actions';

@Injectable()
export class ProjectsEffects {
  constructor(
    private actions$: Actions,
    private apiService: ApiService
  ) {}

  loadProjects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.loadProjects),
      exhaustMap(() =>
        this.apiService.getProjects().pipe(
          map(projects => ProjectActions.loadProjectsSuccess({ projects })),
          catchError(error => of(ProjectActions.loadProjectsFailure({ error: error.message })))
        )
      )
    )
  );

  // 🐛 CHALLENGE 10 (NgRx - Effect not dispatching):
  // This effect handles createProject but has `dispatch: false`,
  // which means the success/failure actions are never dispatched
  // back to the store. The store never receives the new project.
  // FIX: Remove `{ dispatch: false }` so the mapped actions are dispatched.
  createProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.createProject),
      exhaustMap(({ payload }) =>
        this.apiService.createProject(payload).pipe(
          map(project => ProjectActions.createProjectSuccess({ project })),
          catchError(error => of(ProjectActions.createProjectFailure({ error: error.message })))
        )
      )
    ),
    { dispatch: false } // 🐛 BUG: Actions are mapped but never dispatched!
  );
}
