import { InjectionToken } from '@angular/core';

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
}

// 🐛 CHALLENGE 14 (DI - InjectionToken):
// This token is defined but never provided anywhere in the app.
// The NotificationService tries to inject it and crashes at runtime.
// HINT: You need to provide this token — either in app.config.ts or
// using the `providedIn` + `factory` pattern on the token itself.
export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG');
