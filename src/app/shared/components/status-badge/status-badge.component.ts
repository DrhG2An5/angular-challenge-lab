import { Component, input, computed } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { IssueStatus } from '../../../core/models';

// 🐛 CHALLENGE 3 (Signals - input() and computed()):
// This component uses the new signal-based `input()` correctly, but the
// `computed()` for color has a bug: it doesn't call the signal (missing ()).
// `this.status` is the signal itself, not its value. Must call `this.status()`.
// The TypeScript `as any` cast hides this from the compiler, but at runtime
// the switch will never match because it compares a function reference to strings.

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [MatChipsModule],
  template: `
    <mat-chip [style.background-color]="color()" class="text-white text-xs">
      {{ label() }}
    </mat-chip>
  `,
})
export class StatusBadgeComponent {
  status = input.required<IssueStatus>();

  // 🐛 BUG: `this.status` is the signal function, not the value.
  // The `as any` cast hides the type error but the switch never matches at runtime.
  // FIX: Change `this.status as any` to `this.status()`
  color = computed(() => {
    switch (this.status as any) {  // 🐛 Missing () — comparing function reference
      case 'open': return '#ef5350';
      case 'in-progress': return '#42a5f5';
      case 'in-review': return '#ab47bc';
      case 'done': return '#66bb6a';
      case 'closed': return '#bdbdbd';
      default: return '#9e9e9e';  // Always hits default because signal ref !== string
    }
  });

  label = computed(() => {
    return (this.status() ?? '').replace('-', ' ').toUpperCase();
  });
}
