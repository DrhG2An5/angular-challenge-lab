import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// 🐛 CHALLENGE 19 (Routing - Functional Guard):
// This guard should prevent access to protected routes when the user
// is not logged in — but it doesn't protect anything:
// 1. It never checks authService.isLoggedIn(), so anonymous users get in
//    (open the app in a fresh session: you land on the dashboard without
//    ever logging in — that's this bug in action)
// 2. When the user is NOT logged in it should redirect to /login using
//    router.createUrlTree(['/login']) instead of just returning false
//    (returning false alone leaves the user on a blank page)
// FIX: Allow access only when isLoggedIn() is true; otherwise return
// a UrlTree pointing at /login.

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 🐛 BUG: No auth check at all — everyone is allowed through,
  // logged in or not. Protected routes are wide open.
  return true;
};
