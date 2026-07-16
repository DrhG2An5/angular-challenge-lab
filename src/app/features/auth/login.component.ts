import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  template: `
    <div class="flex items-center justify-center h-screen" style="background: var(--app-canvas)">
      <mat-card class="w-[28rem] p-8">
        <div class="text-center mb-6">
          <mat-icon class="text-indigo-600 text-5xl mb-2">bug_report</mat-icon>
          <h1 class="text-2xl font-bold">BugTracker Pro</h1>
          <p class="text-gray-500 mb-0">Mock login — no password, just pick a user</p>
        </div>

        @if (authService.currentUser(); as user) {
          <p class="text-sm text-center text-gray-600 bg-gray-100 rounded p-2 mb-4">
            Currently logged in as <strong>{{ user.name }}</strong> ({{ user.role }}).
            Pick another user to switch.
          </p>
        }

        @for (user of users; track user.id) {
          <button mat-stroked-button class="w-full mb-2 justify-start"
                  (click)="loginAs(user.id)">
            <mat-icon>person</mat-icon>
            <span class="ml-2">{{ user.name }}</span>
            <span class="ml-auto text-xs text-gray-400">({{ user.role }})</span>
          </button>
        }

        <div class="mt-6 text-xs text-gray-500 border-t pt-4">
          <p class="mb-1">
            <strong>Why this page exists:</strong> several routing challenges depend on
            <em>who</em> is logged in.
          </p>
          <ul class="pl-4 m-0 list-disc">
            <li>Challenge 19 — the auth guard should send logged-out visitors here (it doesn't, yet)</li>
            <li>Challenge 20 — the <em>Settings</em> page should only open for the <strong>admin</strong> (Alice)</li>
          </ul>
          <p class="mt-2 mb-0 text-center">
            <a routerLink="/challenges" class="text-indigo-600">View all challenges →</a>
          </p>
        </div>
      </mat-card>
    </div>
  `,
})
export class LoginComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  private mockData = inject(MockDataService);

  users = this.mockData.getUsers();

  loginAs(userId: string): void {
    this.authService.login(userId);
    this.router.navigate(['/dashboard']);
  }
}
