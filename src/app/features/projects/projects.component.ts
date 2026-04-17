import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProjectActions, selectAllProjects, selectProjectsLoading, selectProjectsError } from '../../store/projects';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    TitleCasePipe, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule,
    RouterLink, CardComponent,
  ],
  template: `
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Projects</h2>
        <button mat-raised-button color="primary" routerLink="/projects/new">
          <mat-icon>add</mat-icon> New Project
        </button>
      </div>

      @if (loading()) {
        <div class="flex justify-center p-12">
          <mat-spinner diameter="48"></mat-spinner>
        </div>
      } @else if (error()) {
        <mat-card class="bg-red-50 p-4">
          <p class="text-red-600">Error loading projects: {{ error() }}</p>
          <button mat-button color="primary" (click)="reload()">Retry</button>
        </mat-card>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (project of projects(); track project.id) {
            <!-- 🐛 CHALLENGE 16: CardComponent uses ng-content with wrong selectors -->
            <!-- The parent projects [card-header] attribute vs <card-header> element -->
            <app-card [clickable]="true">
              <div card-header>
                <h3 class="text-lg font-semibold">{{ project.name }}</h3>
              </div>
              <div card-body>
                <p class="text-gray-600 mb-4">{{ project.description }}</p>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Issues: {{ project.issueCount }}</span>
                  <span class="font-medium"
                    [class]="project.status === 'active' ? 'text-green-600' :
                             project.status === 'on-hold' ? 'text-yellow-600' : 'text-gray-500'">
                    {{ project.status | titlecase }}
                  </span>
                </div>
              </div>
              <!-- 🐛 CHALLENGE 17: This footer template is captured by @ContentChild
                   but never rendered in the card component -->
              <ng-template #cardFooter>
                <a mat-button [routerLink]="['/projects', project.id]" color="primary">View Details</a>
              </ng-template>
            </app-card>
          }
        </div>
      }
    </div>
  `,
})
export class ProjectsComponent implements OnInit {
  private store = inject(Store);

  projects = toSignal(this.store.select(selectAllProjects), { initialValue: [] });
  loading = toSignal(this.store.select(selectProjectsLoading), { initialValue: false });
  error = toSignal(this.store.select(selectProjectsError), { initialValue: null });

  ngOnInit(): void {
    this.store.dispatch(ProjectActions.loadProjects());
  }

  reload(): void {
    this.store.dispatch(ProjectActions.loadProjects());
  }
}
