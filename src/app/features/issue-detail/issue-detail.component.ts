import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { PriorityIconComponent } from '../../shared/components/priority-icon/priority-icon.component';
import { UserAvatarComponent } from '../../shared/components/user-avatar/user-avatar.component';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';
import { MockDataService } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-issue-detail',
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, MatIconModule, MatChipsModule,
    MatDividerModule, RouterLink,
    StatusBadgeComponent, PriorityIconComponent, UserAvatarComponent, TimeAgoPipe,
  ],
  template: `
    <div class="max-w-3xl mx-auto">
      @if (issue(); as i) {
        <div class="flex items-center gap-4 mb-6">
          <button mat-icon-button routerLink="/issues">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h2 class="text-2xl font-bold m-0">{{ i.title }}</h2>
        </div>

        <mat-card class="mb-4">
          <mat-card-content class="p-4">
            <div class="flex items-center gap-4 mb-4">
              <app-status-badge [status]="i.status" />
              <app-priority-icon [priority]="i.priority" />
              <mat-chip-set>
                @for (label of i.labels; track label) {
                  <mat-chip>{{ label }}</mat-chip>
                }
              </mat-chip-set>
            </div>

            <mat-divider class="my-4"></mat-divider>

            <p class="text-gray-700 mb-4">{{ i.description }}</p>

            <div class="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span class="font-medium">Reporter:</span>
                {{ getUser(i.reporterId) }}
              </div>
              <div>
                <span class="font-medium">Assignee:</span>
                {{ i.assigneeId ? getUser(i.assigneeId) : 'Unassigned' }}
              </div>
              <div>
                <span class="font-medium">Created:</span>
                {{ i.createdAt | timeAgo }}
              </div>
              <div>
                <span class="font-medium">Updated:</span>
                {{ i.updatedAt | timeAgo }}
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Comments -->
        <h3 class="text-lg font-semibold mb-4">Comments ({{ i.comments.length }})</h3>
        @for (comment of i.comments; track comment.id) {
          <mat-card class="mb-2">
            <mat-card-content class="p-4">
              <div class="flex items-center gap-2 mb-2">
                <app-user-avatar
                  [name]="getUser(comment.authorId)"
                  [initial]="getUser(comment.authorId).charAt(0)"
                  [size]="24" />
                <span class="font-medium text-sm">{{ getUser(comment.authorId) }}</span>
                <span class="text-xs text-gray-400">{{ comment.createdAt | timeAgo }}</span>
              </div>
              <p class="m-0 text-gray-700">{{ comment.text }}</p>
            </mat-card-content>
          </mat-card>
        } @empty {
          <p class="text-gray-400 text-center py-4">No comments yet</p>
        }
      } @else {
        <p class="text-gray-500 text-center py-12">Issue not found</p>
      }
    </div>
  `,
})
export class IssueDetailComponent {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private mockData = inject(MockDataService);

  issue = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('issueId')!),
      switchMap(id => this.apiService.getIssue(id))
    )
  );

  getUser(userId: string): string {
    return this.mockData.getUserById(userId)?.name ?? 'Unknown';
  }
}
