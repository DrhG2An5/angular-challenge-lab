import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="flex items-center justify-center h-screen bg-gray-50">
      <mat-card class="w-96 p-8">
        <div class="text-center mb-6">
          <mat-icon class="text-indigo-600 text-5xl mb-2">bug_report</mat-icon>
          <h1 class="text-2xl font-bold">BugTracker Pro</h1>
          <p class="text-gray-500">Select a user to log in</p>
        </div>

        @for (user of users; track user.id) {
          <button mat-stroked-button class="w-full mb-2 justify-start"
                  (click)="loginAs(user.id)">
            <mat-icon>person</mat-icon>
            <span class="ml-2">{{ user.name }}</span>
            <span class="ml-auto text-xs text-gray-400">({{ user.role }})</span>
          </button>
        }
      </mat-card>
    </div>
  `,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private mockData = inject(MockDataService);

  users = this.mockData.getUsers();

  loginAs(userId: string): void {
    this.authService.login(userId);
    this.router.navigate(['/dashboard']);
  }
}
