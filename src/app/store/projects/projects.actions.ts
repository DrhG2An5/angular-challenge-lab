import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Project, CreateProjectPayload } from '../../core/models';

export const ProjectActions = createActionGroup({
  source: 'Projects',
  events: {
    'Load Projects': emptyProps(),
    'Load Projects Success': props<{ projects: Project[] }>(),
    'Load Projects Failure': props<{ error: string }>(),
    'Create Project': props<{ payload: CreateProjectPayload }>(),
    'Create Project Success': props<{ project: Project }>(),
    'Create Project Failure': props<{ error: string }>(),
    'Select Project': props<{ projectId: string }>(),
    'Update Project Status': props<{ projectId: string; status: string }>(),
  },
});
