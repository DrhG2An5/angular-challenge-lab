import { Component, input, output, TemplateRef, ContentChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

// 🐛 CHALLENGE 16 (Content Projection - ng-content):
// This generic card component should support:
// 1. A projected header (using <ng-content select="[card-header]">)
// 2. A projected body (using <ng-content select="[card-body]">)
// 3. An optional footer template passed via @ContentChild
//
// BUG: The card renders nothing because the ng-content selectors
// don't match what the parent components project. The parent uses
// `card-header` as an element but the selector expects an attribute.
// Also, the footer template is grabbed with @ContentChild but never
// rendered with ngTemplateOutlet.
//
// FIX: Align the selectors between parent and child, and render
// the footer template using <ng-container *ngTemplateOutlet="footerTemplate">

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule],
  template: `
    <mat-card class="challenge-card" [class.clickable]="clickable()">
      <mat-card-header>
        <!-- 🐛 BUG: selector expects attribute [card-header] but parent sends <card-header> element -->
        <ng-content select="card-header"></ng-content>
      </mat-card-header>

      <mat-card-content>
        <ng-content select="[card-body]"></ng-content>
      </mat-card-content>

      <mat-card-actions *ngIf="footerTemplate">
        <!-- 🐛 BUG: footerTemplate exists but is never rendered -->
        <!-- Missing: <ng-container *ngTemplateOutlet="footerTemplate"></ng-container> -->
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .challenge-card {
      margin: 8px;
      transition: box-shadow 0.2s;
    }
    .clickable { cursor: pointer; }
    .clickable:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
  `]
})
export class CardComponent {
  clickable = input(false);
  cardClick = output<void>();

  // 🐛 CHALLENGE 17 (Content Projection - @ContentChild + ngTemplateOutlet):
  // The footer template is captured but never rendered in the template above.
  @ContentChild('cardFooter') footerTemplate?: TemplateRef<any>;
}
