import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProjectActions, selectAllProjects, selectProjectsLoading } from '../../store/projects';
import { IssueActions, selectAllIssues, selectIssueCountByStatus } from '../../store/issues';
import { AuthService } from '../../core/services/auth.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { PriorityIconComponent } from '../../shared/components/priority-icon/priority-icon.component';

// 🐛 CHALLENGE 2 (Standalone - New Control Flow):
// This component uses *ngIf and *ngFor (old syntax) mixed with the
// new @if/@for syntax. The old directives require CommonModule import.
// Some *ngFor usages are missing trackBy which hurts performance.
// FIX: Convert all *ngIf → @if, *ngFor → @for (with track expression).

// 🐛 CHALLENGE 4 (Signals - signal() vs computed()):
// `recentIssues` uses signal() with a one-time value. When allIssues
// loads from the store, recentIssues stays empty because signal() doesn't
// re-evaluate like computed() does.

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule,
    MatDividerModule, RouterLink, StatusBadgeComponent, PriorityIconComponent,
  ],
  template: `
    <div class="dashboard-container">
      <h2 class="text-2xl font-bold mb-6">
        Welcome back, {{ authService.currentUser()?.name ?? 'User' }}!
      </h2>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <mat-card>
          <mat-card-content class="flex items-center gap-4 p-4">
            <mat-icon class="text-blue-500 text-4xl">folder</mat-icon>
            <div>
              <p class="text-sm text-gray-500 m-0">Total Projects</p>
              <p class="text-2xl font-bold m-0">{{ projects().length }}</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-content class="flex items-center gap-4 p-4">
            <mat-icon class="text-red-500 text-4xl">bug_report</mat-icon>
            <div>
              <p class="text-sm text-gray-500 m-0">Open Issues</p>
              <p class="text-2xl font-bold m-0">{{ issueStats().open }}</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-content class="flex items-center gap-4 p-4">
            <mat-icon class="text-yellow-500 text-4xl">hourglass_top</mat-icon>
            <div>
              <p class="text-sm text-gray-500 m-0">In Progress</p>
              <p class="text-2xl font-bold m-0">{{ issueStats()['in-progress'] }}</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-content class="flex items-center gap-4 p-4">
            <mat-icon class="text-green-500 text-4xl">check_circle</mat-icon>
            <div>
              <p class="text-sm text-gray-500 m-0">Done</p>
              <p class="text-2xl font-bold m-0">{{ issueStats().done }}</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Loading spinner -->
      <div *ngIf="loading()" class="flex justify-center p-8">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <!-- Recent Issues -->
      <h3 class="text-lg font-semibold mb-4">Recent Issues</h3>
      <div class="space-y-2">
        <!-- 🐛 CHALLENGE 2: Old *ngFor syntax, missing trackBy -->
        <mat-card *ngFor="let issue of recentIssues()" class="p-2">
          <div class="flex items-center justify-between p-2">
            <div class="flex items-center gap-3">
              <app-priority-icon [priority]="issue.priority" />
              <div>
                <a [routerLink]="['/issues', issue.id]" class="font-medium hover:underline">
                  {{ issue.title }}
                </a>
                <p class="text-sm text-gray-500 m-0">{{ issue.projectId }}</p>
              </div>
            </div>
            <app-status-badge [status]="issue.status" />
          </div>
        </mat-card>
      </div>

      <!-- Projects Overview -->
      <h3 class="text-lg font-semibold mt-8 mb-4">Projects</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 🐛 CHALLENGE 2: Old *ngFor syntax -->
        <mat-card *ngFor="let project of projects()" [routerLink]="['/projects', project.id]"
                  class="cursor-pointer hover:shadow-lg transition-shadow">
          <mat-card-header>
            <mat-card-title>{{ project.name }}</mat-card-title>
            <mat-card-subtitle>{{ project.description }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content class="mt-2">
            <div class="flex justify-between text-sm text-gray-500">
              <span>{{ project.openIssueCount }} open / {{ project.issueCount }} total</span>
              <span class="capitalize px-2 py-1 rounded text-xs"
                    [class]="project.status === 'active' ? 'bg-green-100 text-green-800' :
                             project.status === 'on-hold' ? 'bg-yellow-100 text-yellow-800' :
                             'bg-gray-100 text-gray-800'">
                {{ project.status }}
              </span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { max-width: 1200px; margin: 0 auto; }
  `]
})
export class DashboardComponent implements OnInit {
  private store = inject(Store);
  authService = inject(AuthService);

  projects = toSignal(this.store.select(selectAllProjects), { initialValue: [] });
  loading = toSignal(this.store.select(selectProjectsLoading), { initialValue: false });
  issueStats = toSignal(this.store.select(selectIssueCountByStatus), {
    initialValue: { open: 0, 'in-progress': 0, 'in-review': 0, done: 0, closed: 0 }
  });

  allIssues = toSignal(this.store.select(selectAllIssues), { initialValue: [] });

  // 🐛 CHALLENGE 4: signal() captures the value ONCE at construction time.
  // At this point allIssues() is still [] (data hasn't loaded yet).
  // When the store updates, this signal does NOT re-compute.
  // FIX: Use computed(() => this.allIssues().slice(0, 5)) instead.
  recentIssues = signal(this.allIssues().slice(0, 5));

  ngOnInit(): void {
    this.store.dispatch(ProjectActions.loadProjects());
    this.store.dispatch(IssueActions.loadIssues());
  }
}
