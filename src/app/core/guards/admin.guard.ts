import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// 🐛 CHALLENGE 20 (Routing - Guard with Redirect):
// This admin guard checks isAdmin but doesn't use the signal correctly.
// `authService.isAdmin` is a computed signal, so it needs to be called: `isAdmin()`
// Also, no redirect is provided when access is denied.

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 🐛 BUG: isAdmin is a signal, need isAdmin() to get the value
  // The signal reference itself is always truthy, so this always passes!
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (authService.isAdmin as unknown as boolean) {
    return true;
  }

  // 🐛 BUG: Should redirect to /dashboard or / instead of returning false
  return false;
};
