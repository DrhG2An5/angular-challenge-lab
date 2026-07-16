import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { ThemeService } from '../core/services/theme.service';
import { Subscription, interval } from 'rxjs';

// 🐛 CHALLENGE 11 (RxJS - Memory Leak):
// This component subscribes to an interval observable in ngOnInit
// but never unsubscribes in ngOnDestroy. This causes a memory leak.
// The subscription keeps running even after the component is destroyed.
// FIX: Store the subscription and unsubscribe in ngOnDestroy,
// OR use takeUntilDestroyed() from '@angular/core/rxjs-interop' (modern way).

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive,
    MatSidenavModule, MatToolbarModule, MatListModule,
    MatIconModule, MatButtonModule, MatMenuModule, MatBadgeModule,
  ],
  template: `
    <mat-sidenav-container class="h-screen">
      <mat-sidenav mode="side" [opened]="sidenavOpen()" class="w-64 p-4">
        <div class="flex items-center gap-2 mb-6 p-2">
          <mat-icon class="text-indigo-600">bug_report</mat-icon>
          <h1 class="text-xl font-bold text-indigo-600 m-0">BugTracker Pro</h1>
        </div>

        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/projects" routerLinkActive="active-link">
            <mat-icon matListItemIcon>folder</mat-icon>
            <span matListItemTitle>Projects</span>
          </a>
          <a mat-list-item routerLink="/issues" routerLinkActive="active-link">
            <mat-icon matListItemIcon>list_alt</mat-icon>
            <span matListItemTitle>Issues</span>
          </a>
          <mat-divider></mat-divider>
          <a mat-list-item routerLink="/settings" routerLinkActive="active-link">
            <mat-icon matListItemIcon>settings</mat-icon>
            <span matListItemTitle>Settings</span>
          </a>
          <a mat-list-item routerLink="/challenges" routerLinkActive="active-link">
            <mat-icon matListItemIcon>school</mat-icon>
            <span matListItemTitle>Challenges</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary" class="flex justify-between">
          <div class="flex items-center gap-2">
            <button mat-icon-button (click)="toggleSidenav()">
              <mat-icon>menu</mat-icon>
            </button>
            <span>BugTracker Pro</span>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-sm opacity-75">Live: {{ tickCount }} ticks</span>
            <button mat-icon-button (click)="themeService.toggle()">
              <mat-icon>{{ themeService.darkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
            </button>

            @if (authService.currentUser(); as user) {
              <button mat-icon-button [matMenuTriggerFor]="userMenu">
                <mat-icon>account_circle</mat-icon>
              </button>
              <mat-menu #userMenu="matMenu">
                <div class="px-4 py-2 border-b">
                  <p class="font-medium m-0">{{ user.name }}</p>
                  <p class="text-sm text-gray-500 m-0">{{ user.email }}</p>
                  <p class="text-xs text-gray-400 m-0">Role: {{ user.role }}</p>
                </div>
                <button mat-menu-item routerLink="/login">
                  <mat-icon>swap_horiz</mat-icon> Switch user
                </button>
                <button mat-menu-item (click)="logout()">
                  <mat-icon>logout</mat-icon> Logout
                </button>
              </mat-menu>
            } @else {
              <button mat-stroked-button routerLink="/login">
                <mat-icon>login</mat-icon> Sign in
              </button>
            }
          </div>
        </mat-toolbar>

        <main class="p-6">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .active-link { background-color: rgba(63, 81, 181, 0.08); }
    mat-sidenav { border-right: 1px solid #e0e0e0; }
  `]
})
export class ShellComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  private router = inject(Router);

  sidenavOpen = signal(true);
  tickCount = 0;

  // 🐛 CHALLENGE 11: This subscription is never cleaned up!
  private tickSub!: Subscription;

  ngOnInit(): void {
    // 🐛 BUG: Subscribes but never unsubscribes → memory leak
    // This simulates a "live updates" counter
    this.tickSub = interval(1000).subscribe(n => {
      this.tickCount = n;
    });
  }

  ngOnDestroy(): void {
    // 🐛 BUG: Missing this.tickSub.unsubscribe()
    // The interval keeps running forever after navigation away
  }

  toggleSidenav(): void {
    this.sidenavOpen.update(v => !v);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
