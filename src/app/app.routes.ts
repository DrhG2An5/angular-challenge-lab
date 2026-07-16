import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { projectResolver } from './core/guards/project.resolver';

// 🐛 CHALLENGE 22 (Routing - Lazy Loading):
// The settings route uses loadComponent, but SettingsComponent is NOT
// standalone — it's declared in an NgModule. This will fail at runtime.
// FIX: Either make SettingsComponent standalone, or use loadChildren
// with the NgModule/routing module approach.

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],  // 🐛 CHALLENGE 19: Guard doesn't actually protect anything
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'projects',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent),
          },
          {
            path: ':projectId',
            loadComponent: () => import('./features/project-detail/project-detail.component').then(m => m.ProjectDetailComponent),
            resolve: { project: projectResolver }, // 🐛 CHALLENGE 21: resolver reads wrong param
          },
        ],
      },
      {
        path: 'issues',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/issues/issues.component').then(m => m.IssuesComponent),
          },
          {
            path: ':issueId',
            loadComponent: () => import('./features/issue-detail/issue-detail.component').then(m => m.IssueDetailComponent),
          },
        ],
      },
      {
        // 🐛 CHALLENGE 22: loadComponent won't work with NgModule-declared component
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
        canActivate: [adminGuard], // 🐛 CHALLENGE 20: Guard doesn't call signal()
      },
      {
        path: 'challenges',
        loadComponent: () => import('./features/challenges/challenges.component').then(m => m.ChallengesComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
