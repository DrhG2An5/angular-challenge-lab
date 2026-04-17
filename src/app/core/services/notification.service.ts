import { inject, Injectable } from '@angular/core';
import { API_CONFIG, ApiConfig } from '../tokens/api-config.token';
import { LOGGER, Logger } from '../tokens/logger.token';

// 🐛 CHALLENGE 14 (DI - InjectionToken):
// This service injects API_CONFIG, but that token is never provided.
// The app will crash when this service is first instantiated.
// FIX: Provide the API_CONFIG token in app.config.ts or use a default value.
//
// 🐛 CHALLENGE 15 (DI - Multi Providers):
// LOGGER is injected as a single Logger, but we want ALL registered loggers.
// When using multi: true, the injected type becomes Logger[], not Logger.
// FIX: Change injection to inject(LOGGER) as Logger[] and iterate over all loggers.

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private config = inject(API_CONFIG);
  private logger = inject(LOGGER);

  success(message: string): void {
    this.logger.log(`[SUCCESS] ${message}`);
    // In a real app, show a snackbar/toast
    console.log(`✅ ${message} (timeout: ${this.config.timeout}ms)`);
  }

  error(message: string): void {
    this.logger.error(`[ERROR] ${message}`);
    console.error(`❌ ${message}`);
  }

  warn(message: string): void {
    this.logger.warn(`[WARN] ${message}`);
    console.warn(`⚠️ ${message}`);
  }
}
