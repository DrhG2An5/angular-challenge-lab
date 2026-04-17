import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

// 🐛 CHALLENGE 1 (Standalone - @Input to input()):
// This component works but uses the OLD @Input() decorator pattern.
// Convert all @Input() properties to the new signal-based input() function.
// HINT: import { input } from '@angular/core', then replace:
//   @Input() title = '' → title = input('');
// Signal inputs are read in templates with title() instead of title.

@Component({
  selector: 'app-challenge-hint',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatIconModule, MatChipsModule],
  template: `
    <mat-expansion-panel class="challenge-hint-panel">
      <mat-expansion-panel-header>
        <mat-panel-title>
          <mat-icon>lightbulb</mat-icon>
          <span class="ml-2">Challenge {{ challengeNumber }}: {{ title }}</span>
        </mat-panel-title>
        <mat-panel-description>
          <mat-chip-set>
            <mat-chip [class]="'difficulty-' + difficulty">{{ difficulty }}</mat-chip>
            <mat-chip>{{ category }}</mat-chip>
          </mat-chip-set>
        </mat-panel-description>
      </mat-expansion-panel-header>
      <div class="hint-content">
        <p class="hint-text">{{ hint }}</p>
        <p class="file-location" *ngIf="fileLocation">
          📁 File: <code>{{ fileLocation }}</code>
        </p>
      </div>
    </mat-expansion-panel>
  `,
  styles: [`
    .challenge-hint-panel { margin: 8px 0; }
    .hint-content { padding: 8px 0; }
    .hint-text { color: #555; margin-bottom: 8px; }
    .file-location code { background: #f5f5f5; padding: 2px 6px; border-radius: 4px; }
    .difficulty-easy { background-color: #c8e6c9 !important; }
    .difficulty-medium { background-color: #fff9c4 !important; }
    .difficulty-hard { background-color: #ffcdd2 !important; }
  `]
})
export class ChallengeHintComponent {
  // 🐛 CHALLENGE 1: Convert these @Input() to signal-based input()
  @Input() challengeNumber = 0;
  @Input() title = '';
  @Input() hint = '';
  @Input() difficulty: 'easy' | 'medium' | 'hard' = 'easy';
  @Input() category = '';
  @Input() fileLocation = '';
}
