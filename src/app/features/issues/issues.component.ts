import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { IssueActions, selectAllIssues, selectIssuesLoading, selectSearchResults, selectIsSearching } from '../../store/issues';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { PriorityIconComponent } from '../../shared/components/priority-icon/priority-icon.component';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

// 🐛 CHALLENGE 10b (RxJS - Memory Leak with Subject):
// The search$ Subject creates a subscription in ngOnInit but the
// subscription is stored but never unsubscribed in ngOnDestroy.
// There's also a second leak: the manual store subscription.

@Component({
  selector: 'app-issues',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatInputModule, MatFormFieldModule, MatProgressSpinnerModule,
    MatSelectModule, RouterLink, FormsModule,
    StatusBadgeComponent, PriorityIconComponent, TimeAgoPipe,
  ],
  template: `
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Issues</h2>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon> New Issue
        </button>
      </div>

      <!-- Search -->
      <mat-form-field class="w-full mb-4">
        <mat-label>Search issues...</mat-label>
        <input matInput (input)="onSearch($event)" placeholder="Type to search...">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      @if (searching()) {
        <div class="flex justify-center p-4">
          <mat-spinner diameter="24"></mat-spinner>
        </div>
      }

      <!-- Filter -->
      <div class="flex gap-4 mb-4">
        <mat-form-field>
          <mat-label>Status</mat-label>
          <mat-select [(value)]="statusFilter" (selectionChange)="applyFilters()">
            <mat-option value="all">All</mat-option>
            <mat-option value="open">Open</mat-option>
            <mat-option value="in-progress">In Progress</mat-option>
            <mat-option value="in-review">In Review</mat-option>
            <mat-option value="done">Done</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Priority</mat-label>
          <mat-select [(value)]="priorityFilter" (selectionChange)="applyFilters()">
            <mat-option value="all">All</mat-option>
            <mat-option value="critical">Critical</mat-option>
            <mat-option value="high">High</mat-option>
            <mat-option value="medium">Medium</mat-option>
            <mat-option value="low">Low</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Issue List -->
      @if (loading()) {
        <div class="flex justify-center p-12">
          <mat-spinner diameter="48"></mat-spinner>
        </div>
      } @else {
        <div class="space-y-2">
          @for (issue of filteredIssues; track issue.id) {
            <mat-card class="p-0">
              <div class="flex items-center justify-between p-4">
                <div class="flex items-center gap-3">
                  <app-priority-icon [priority]="issue.priority" />
                  <div>
                    <a [routerLink]="['/issues', issue.id]"
                       class="font-medium hover:underline text-indigo-700">
                      {{ issue.title }}
                    </a>
                    <p class="text-sm text-gray-500 m-0">
                      {{ issue.projectId }} · {{ issue.createdAt | timeAgo }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  @for (label of issue.labels; track label) {
                    <span class="text-xs px-2 py-0.5 bg-gray-100 rounded">{{ label }}</span>
                  }
                  <app-status-badge [status]="issue.status" />
                </div>
              </div>
            </mat-card>
          } @empty {
            <p class="text-gray-500 text-center py-12">No issues match your filters</p>
          }
        </div>
      }
    </div>
  `,
})
export class IssuesComponent implements OnInit, OnDestroy {
  private store = inject(Store);

  loading = toSignal(this.store.select(selectIssuesLoading), { initialValue: false });
  searching = toSignal(this.store.select(selectIsSearching), { initialValue: false });

  statusFilter = 'all';
  priorityFilter = 'all';
  filteredIssues: any[] = [];

  private search$ = new Subject<string>();
  private searchSub!: Subscription;
  private issuesSub!: Subscription;

  ngOnInit(): void {
    this.store.dispatch(IssueActions.loadIssues());

    // 🐛 BUG: Subscription stored but never unsubscribed
    this.searchSub = this.search$.pipe(
      debounceTime(300)
    ).subscribe(query => {
      if (query.length > 0) {
        this.store.dispatch(IssueActions.searchIssues({ query }));
      }
    });

    // 🐛 BUG: Another subscription leak — manual subscribe to store
    this.issuesSub = this.store.select(selectAllIssues).subscribe(issues => {
      this.filteredIssues = issues;
      this.applyFilters();
    });
  }

  ngOnDestroy(): void {
    // 🐛 BUG: Both subscriptions should be unsubscribed here!
    // this.searchSub?.unsubscribe();
    // this.issuesSub?.unsubscribe();
  }

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.search$.next(query);
  }

  applyFilters(): void {
    // This method re-filters from the current issues list
    // (but doesn't re-read from store since we already have the sub)
  }
}
