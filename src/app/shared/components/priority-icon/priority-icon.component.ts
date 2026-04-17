import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IssuePriority } from '../../../core/models';

@Component({
  selector: 'app-priority-icon',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule],
  template: `
    @switch (priority()) {
      @case ('critical') {
        <mat-icon class="text-red-600" matTooltip="Critical">error</mat-icon>
      }
      @case ('high') {
        <mat-icon class="text-orange-500" matTooltip="High">arrow_upward</mat-icon>
      }
      @case ('medium') {
        <mat-icon class="text-yellow-600" matTooltip="Medium">remove</mat-icon>
      }
      @case ('low') {
        <mat-icon class="text-blue-400" matTooltip="Low">arrow_downward</mat-icon>
      }
    }
  `,
})
export class PriorityIconComponent {
  priority = input.required<IssuePriority>();
}
