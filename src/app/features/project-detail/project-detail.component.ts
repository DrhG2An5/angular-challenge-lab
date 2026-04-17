import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { IssueActions, selectAllIssues } from '../../store/issues';
import { Project } from '../../core/models';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { PriorityIconComponent } from '../../shared/components/priority-icon/priority-icon.component';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';
import { ApiService } from '../../core/services/api.service';

// 🐛 CHALLENGE 12 (RxJS - Error kills stream):
// The project stats observable randomly throws errors (simulating a flaky API).
// When it errors, the entire component stops updating because the stream dies.
// FIX: Use catchError inside the pipe to provide a fallback value,
// and optionally use retry() to retry failed requests.

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatTabsModule, MatChipsModule, RouterLink,
    StatusBadgeComponent, PriorityIconComponent, TimeAgoPipe,
  ],
  template: `
    <div class="max-w-4xl mx-auto">
      @if (project; as p) {
        <div class="flex items-center gap-4 mb-6">
          <button mat-icon-button routerLink="/projects">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div>
            <h2 class="text-2xl font-bold m-0">{{ p.name }}</h2>
            <p class="text-gray-500 m-0">{{ p.description }}</p>
          </div>
        </div>

        <!-- Project Stats (flaky endpoint) -->
        <div class="grid grid-cols-3 gap-4 mb-6">
          @if (stats(); as s) {
            <mat-card class="p-4 text-center">
              <p class="text-3xl font-bold text-red-500">{{ s.open }}</p>
              <p class="text-sm text-gray-500">Open</p>
            </mat-card>
            <mat-card class="p-4 text-center">
              <p class="text-3xl font-bold text-green-500">{{ s.closed }}</p>
              <p class="text-sm text-gray-500">Closed</p>
            </mat-card>
            <mat-card class="p-4 text-center">
              <p class="text-3xl font-bold text-blue-500">{{ s.velocity }}</p>
              <p class="text-sm text-gray-500">Velocity</p>
            </mat-card>
          } @else {
            <mat-card class="p-4 col-span-3 text-center text-red-500">
              Failed to load stats — the API is flaky! (Challenge 12)
            </mat-card>
          }
        </div>

        <!-- Issues Tab -->
        <mat-tab-group>
          <mat-tab label="Issues">
            <div class="p-4">
              @for (issue of projectIssues(); track issue.id) {
                <div class="flex items-center justify-between p-3 border-b">
                  <div class="flex items-center gap-3">
                    <app-priority-icon [priority]="issue.priority" />
                    <div>
                      <a [routerLink]="['/issues', issue.id]" class="font-medium hover:underline">
                        {{ issue.title }}
                      </a>
                      <p class="text-xs text-gray-400 m-0">{{ issue.createdAt | timeAgo }}</p>
                    </div>
                  </div>
                  <app-status-badge [status]="issue.status" />
                </div>
              } @empty {
                <p class="text-gray-500 text-center py-8">No issues in this project</p>
              }
            </div>
          </mat-tab>
          <mat-tab label="Members">
            <div class="p-4">
              <p class="text-gray-500">Members: {{ p.memberIds.length }}</p>
            </div>
          </mat-tab>
        </mat-tab-group>
      } @else {
        <p class="text-gray-500 text-center py-12">Project not found</p>
      }
    </div>
  `,
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private apiService = inject(ApiService);

  // 🐛 CHALLENGE 21: The resolver passes data but uses wrong param name.
  // This component reads from route.data which comes from the resolver.
  project = this.route.snapshot.data['project'] as Project | undefined;

  projectIssues = toSignal(
    this.store.select(selectAllIssues).pipe(
      map(issues => issues.filter(i => i.projectId === this.project?.id))
    ),
    { initialValue: [] }
  );

  // 🐛 CHALLENGE 12: No error handling — when getProjectStats throws,
  // the signal gets no value and stats displays the error fallback forever.
  // With proper catchError + retry, it could recover.
  stats = toSignal(
    this.apiService.getProjectStats(this.project?.id ?? ''),
  );

  ngOnInit(): void {
    if (this.project) {
      this.store.dispatch(IssueActions.loadIssuesByProject({ projectId: this.project.id }));
    }
  }
}
