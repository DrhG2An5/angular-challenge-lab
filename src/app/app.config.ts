import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { projectsReducer } from './store/projects';
import { ProjectsEffects } from './store/projects';
import { issuesReducer } from './store/issues';
import { IssuesEffects } from './store/issues';
import { LOGGER, ConsoleLogger, RemoteLogger } from './core/tokens/logger.token';
// import { API_CONFIG } from './core/tokens/api-config.token'; // 🐛 CHALLENGE 14: Uncomment and provide

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),

    // NgRx Store
    provideStore({
      projects: projectsReducer,
      issues: issuesReducer,
    }),
    provideEffects([ProjectsEffects, IssuesEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),

    // 🐛 CHALLENGE 14 (DI - InjectionToken):
    // API_CONFIG is injected by NotificationService but never provided here.
    // Uncomment and add: { provide: API_CONFIG, useValue: { baseUrl: '/api', timeout: 5000, retryAttempts: 3 } },

    // 🐛 CHALLENGE 15 (DI - Multi Providers):
    // Only one logger is provided. Both should use `multi: true` so they
    // coexist. Without multi:true, the second registration overwrites the first.
    { provide: LOGGER, useClass: ConsoleLogger },
    { provide: LOGGER, useClass: RemoteLogger },
    // FIX: Add multi: true to both:
    // { provide: LOGGER, useClass: ConsoleLogger, multi: true },
    // { provide: LOGGER, useClass: RemoteLogger, multi: true },
  ]
};
