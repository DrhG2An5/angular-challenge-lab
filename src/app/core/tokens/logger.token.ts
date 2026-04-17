import { InjectionToken } from '@angular/core';

export interface Logger {
  log(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}

// 🐛 CHALLENGE 15 (DI - Multi Providers):
// We want multiple logger implementations (ConsoleLogger, RemoteLogger)
// to ALL be active at the same time. But currently only the last one
// registered wins.
// HINT: Look into the `multi: true` option when providing this token,
// and how the injection type changes to Logger[].
export const LOGGER = new InjectionToken<Logger>('LOGGER');

export class ConsoleLogger implements Logger {
  log(message: string, ...args: any[]) { console.log(`[Console] ${message}`, ...args); }
  warn(message: string, ...args: any[]) { console.warn(`[Console] ${message}`, ...args); }
  error(message: string, ...args: any[]) { console.error(`[Console] ${message}`, ...args); }
}

export class RemoteLogger implements Logger {
  log(message: string, ...args: any[]) { console.log(`[Remote → API] ${message}`, ...args); }
  warn(message: string, ...args: any[]) { console.warn(`[Remote → API] ${message}`, ...args); }
  error(message: string, ...args: any[]) { console.error(`[Remote → API] ${message}`, ...args); }
}
