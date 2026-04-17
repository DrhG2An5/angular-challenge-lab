import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';

// 🐛 CHALLENGE 13 (DI - Functional Interceptor):
// This is the modern functional interceptor (v15+), replacing class-based ones.
// It's correctly implemented but not registered in app.config.ts.
// FIX: Use provideHttpClient(withInterceptors([loadingInterceptor])) in app.config.ts

let activeRequests = 0;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  activeRequests++;
  console.log(`[Loading] Request started: ${req.url} (active: ${activeRequests})`);

  return next(req).pipe(
    finalize(() => {
      activeRequests--;
      console.log(`[Loading] Request finished: ${req.url} (active: ${activeRequests})`);
    })
  );
};
