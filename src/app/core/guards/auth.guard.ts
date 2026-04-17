import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// 🐛 CHALLENGE 19 (Routing - Functional Guard):
// This guard should prevent access to protected routes when the user
// is not logged in. But it has two bugs:
// 1. It returns the OPPOSITE of what it should (allows when not logged in)
// 2. It doesn't redirect to login — just returns false, leaving a blank page
// FIX: Invert the logic and use router.createUrlTree() for redirect.

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 🐛 BUG: Logic is inverted — this blocks logged-in users!
  if (authService.isLoggedIn()) {
    return false;
  }

  return true; // 🐛 BUG: Allows unauthenticated access
};
