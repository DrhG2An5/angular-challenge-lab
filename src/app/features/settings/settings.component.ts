import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';

// 🐛 CHALLENGE 1b (Standalone - Modern Approach):
// This component is standalone and works. But it was recently converted
// from an NgModule-based component, and the old NgModule class is still
// exported from this file (dead code). Clean it up!
// Also, the old *ngIf in a comment reference below shows the legacy approach.

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    MatCardModule, MatSlideToggleModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSelectModule, FormsModule,
  ],
  template: `
    <div class="max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Settings</h2>

      <mat-card class="mb-4">
        <mat-card-header>
          <mat-card-title>Appearance</mat-card-title>
        </mat-card-header>
        <mat-card-content class="p-4">
          <mat-slide-toggle
            [checked]="themeService.darkMode()"
            (change)="themeService.toggle()">
            Dark Mode
          </mat-slide-toggle>
          <p class="text-xs text-gray-400 mt-2">
            💡 Challenge 6: Toggle this and check the console. Does the effect in ThemeService loop?
          </p>
        </mat-card-content>
      </mat-card>

      <mat-card class="mb-4">
        <mat-card-header>
          <mat-card-title>Account</mat-card-title>
        </mat-card-header>
        <mat-card-content class="p-4">
          <mat-form-field class="w-full mb-2">
            <mat-label>Display Name</mat-label>
            <input matInput [value]="authService.currentUser()?.name ?? ''">
          </mat-form-field>

          <mat-form-field class="w-full mb-2">
            <mat-label>Email</mat-label>
            <input matInput [value]="authService.currentUser()?.email ?? ''">
          </mat-form-field>

          <mat-form-field class="w-full mb-2">
            <mat-label>Switch User (for testing)</mat-label>
            <mat-select (selectionChange)="authService.login($event.value)">
              @for (user of users; track user.id) {
                <mat-option [value]="user.id">{{ user.name }} ({{ user.role }})</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Admin Panel</mat-card-title>
        </mat-card-header>
        <mat-card-content class="p-4">
          <p class="text-gray-500 mb-4">
            Admin status (computed signal): {{ authService.isAdmin() ? 'Yes ✅' : 'No ❌' }}
          </p>
          <p class="text-sm text-gray-400">
            💡 Challenge 5: Switch to Alice (admin) — does isAdmin update correctly? Check auth.service.ts
          </p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class SettingsComponent {
  themeService = inject(ThemeService);
  authService = inject(AuthService);
  private mockData = inject(MockDataService);
  users = this.mockData.getUsers();
}
