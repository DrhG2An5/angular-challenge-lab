import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

interface Challenge {
  number: number;
  title: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  file: string;
  description: string;
  hint: string;
}

@Component({
  selector: 'app-challenges',
  standalone: true,
  imports: [MatCardModule, MatExpansionModule, MatIconModule, MatChipsModule, MatDividerModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-2">Angular Challenges</h2>
      <p class="text-gray-500 mb-6">
        This app contains {{ challenges.length }} intentional bugs and design issues.
        Find and fix them to level up your Angular skills! Look for 🐛 comments in the code.
      </p>

      @for (tier of tiers; track tier.name) {
        <h3 class="text-lg font-semibold mt-6 mb-3 text-indigo-700">{{ tier.name }}</h3>
        <mat-accordion>
          @for (challenge of getChallengesByTier(tier.categories); track challenge.number) {
            <mat-expansion-panel>
              <mat-expansion-panel-header>
                <mat-panel-title class="flex items-center gap-2">
                  <span class="font-mono text-sm text-gray-400">#{{ challenge.number }}</span>
                  <span>{{ challenge.title }}</span>
                </mat-panel-title>
                <mat-panel-description class="flex items-center gap-2">
                  <mat-chip [class]="{
                    'bg-green-100 text-green-800': challenge.difficulty === 'easy',
                    'bg-yellow-100 text-yellow-800': challenge.difficulty === 'medium',
                    'bg-red-100 text-red-800': challenge.difficulty === 'hard'
                  }">{{ challenge.difficulty }}</mat-chip>
                  <mat-chip class="bg-blue-50 text-blue-700">{{ challenge.category }}</mat-chip>
                </mat-panel-description>
              </mat-expansion-panel-header>

              <div class="py-2">
                <p class="text-gray-700 mb-2">{{ challenge.description }}</p>
                <p class="text-sm text-gray-500 mb-2">
                  📁 <code class="bg-gray-100 px-1 rounded">{{ challenge.file }}</code>
                </p>

                <mat-expansion-panel class="mt-2">
                  <mat-expansion-panel-header>
                    <mat-panel-title class="text-sm">
                      💡 Show Hint
                    </mat-panel-title>
                  </mat-expansion-panel-header>
                  <p class="text-sm text-indigo-600">{{ challenge.hint }}</p>
                </mat-expansion-panel>
              </div>
            </mat-expansion-panel>
          }
        </mat-accordion>
      }
    </div>
  `,
})
export class ChallengesComponent {
  tiers = [
    { name: 'Tier 1: Standalone & Modern Syntax', categories: ['Standalone'] },
    { name: 'Tier 2: Signals & Reactivity', categories: ['Signals'] },
    { name: 'Tier 3: NgRx State Management', categories: ['NgRx'] },
    { name: 'Tier 4: RxJS Patterns', categories: ['RxJS'] },
    { name: 'Tier 5: Dependency Injection', categories: ['DI'] },
    { name: 'Tier 6: Content Projection', categories: ['Projection'] },
    { name: 'Tier 7: Routing', categories: ['Routing'] },
  ];

  challenges: Challenge[] = [
    // Tier 1: Standalone & Modern Syntax
    {
      number: 1, title: 'Convert ChallengeHintComponent to standalone',
      category: 'Standalone', difficulty: 'easy',
      file: 'shared/components/challenge-hint/challenge-hint.component.ts',
      description: 'This component is missing `standalone: true` and its Material module imports. It also uses the old @Input() decorator instead of the new input() signal function.',
      hint: 'Add standalone: true to @Component, add imports: [MatExpansionModule, MatIconModule, MatChipsModule, CommonModule], and optionally convert @Input() to input().',
    },
    {
      number: 2, title: 'Convert old *ngIf/*ngFor to @if/@for',
      category: 'Standalone', difficulty: 'easy',
      file: 'features/dashboard/dashboard.component.ts',
      description: 'The dashboard mixes old structural directives (*ngIf, *ngFor) with the new control flow syntax (@if, @for). Convert all old syntax to the new built-in control flow.',
      hint: '*ngIf="expr" → @if (expr) { }. *ngFor="let item of items" → @for (item of items; track item.id) { }. The @for block REQUIRES a track expression.',
    },
    {
      number: 3, title: 'Fix signal input not called as function',
      category: 'Standalone', difficulty: 'easy',
      file: 'shared/components/status-badge/status-badge.component.ts',
      description: 'The StatusBadgeComponent uses input() signal but the computed() that reads it forgets to call the signal as a function. It compares the signal reference instead of its value.',
      hint: 'In the computed() body, change `this.status` to `this.status()`. Signal inputs must be called to read their value.',
    },

    // Tier 2: Signals
    {
      number: 4, title: 'Fix toSignal usage — signal() vs computed()',
      category: 'Signals', difficulty: 'medium',
      file: 'features/dashboard/dashboard.component.ts',
      description: 'The `recentIssues` property uses signal() with an initial computed value, but signal() captures the value once. When the source data loads, recentIssues stays stale.',
      hint: 'Replace `signal(this.allIssues().slice(0, 5))` with `computed(() => this.allIssues().slice(0, 5))`. computed() re-evaluates whenever its dependencies change.',
    },
    {
      number: 5, title: 'Fix BehaviorSubject ↔ Signal sync in AuthService',
      category: 'Signals', difficulty: 'medium',
      file: 'core/services/auth.service.ts',
      description: 'The AuthService has both a BehaviorSubject and a signal for currentUser, but they get out of sync. The computed `isAdmin` reads from the BehaviorSubject instead of the signal.',
      hint: 'Either remove the BehaviorSubject entirely and use signals only, or sync them properly. The `isAdmin` computed should read `this.currentUser()` not `this.currentUser$.getValue()`.',
    },
    {
      number: 6, title: 'Fix infinite loop in ThemeService effect()',
      category: 'Signals', difficulty: 'hard',
      file: 'core/services/theme.service.ts',
      description: 'The effect() reads the darkMode signal (creating a dependency), writes to localStorage, then reads localStorage and sets the signal again — triggering the effect again infinitely.',
      hint: 'Remove the localStorage read + signal.set() from inside the effect. Initialize the signal from localStorage in the constructor BEFORE the effect, and let the effect only persist TO localStorage.',
    },

    // Tier 3: NgRx
    {
      number: 7, title: 'Fix NgRx selector not finding selected project',
      category: 'NgRx', difficulty: 'medium',
      file: 'store/projects/projects.selectors.ts',
      description: 'The selectSelectedProject selector is defined but always returns null. The logic is correct — check if the issue is elsewhere.',
      hint: 'The selector itself is fine. The issue is that selectProject is never dispatched, or the selectedProjectId is never set. Trace the data flow from component → action → reducer.',
    },
    {
      number: 8, title: 'Fix state mutation in projects reducer',
      category: 'NgRx', difficulty: 'medium',
      file: 'store/projects/projects.reducer.ts',
      description: 'The createProjectSuccess handler mutates state.projects with push() and returns the same state reference. NgRx requires immutable state updates.',
      hint: 'Replace `state.projects.push(project); return state;` with `return { ...state, projects: [...state.projects, project] };`',
    },
    {
      number: 9, title: 'Fix nested state mutation in updateProjectStatus',
      category: 'NgRx', difficulty: 'hard',
      file: 'store/projects/projects.reducer.ts',
      description: 'The updateProjectStatus handler uses find() to get the project, then directly mutates it. Even though it spreads the outer state, the inner project object reference is shared.',
      hint: 'Use map() to create new project objects: `projects: state.projects.map(p => p.id === projectId ? { ...p, status } : p)`',
    },
    {
      number: 10, title: 'Fix effect with dispatch: false',
      category: 'NgRx', difficulty: 'easy',
      file: 'store/projects/projects.effects.ts',
      description: 'The createProject$ effect maps API results to success/failure actions, but has `{ dispatch: false }` — the mapped actions are created but never dispatched to the store.',
      hint: 'Remove `{ dispatch: false }` from the createEffect() call. dispatch: false is only for effects that perform side-effects without dispatching actions (like showing a notification).',
    },

    // Tier 4: RxJS
    {
      number: 11, title: 'Fix memory leak — unsubscribed interval',
      category: 'RxJS', difficulty: 'easy',
      file: 'layout/shell.component.ts',
      description: 'The ShellComponent subscribes to interval(1000) in ngOnInit but the subscription is never cleaned up in ngOnDestroy. The interval runs forever even after navigation.',
      hint: 'Either call this.tickSub.unsubscribe() in ngOnDestroy, or use takeUntilDestroyed(this.destroyRef) from @angular/core/rxjs-interop for the modern approach.',
    },
    {
      number: 12, title: 'Fix race condition with mergeMap in search',
      category: 'RxJS', difficulty: 'medium',
      file: 'store/issues/issues.effects.ts',
      description: 'The searchIssues$ effect uses mergeMap, meaning multiple concurrent searches run in parallel. Slower old searches can resolve after faster new ones, showing stale results.',
      hint: 'Replace mergeMap with switchMap. switchMap cancels the previous inner observable when a new value arrives, ensuring only the latest search result is used.',
    },
    {
      number: 13, title: 'Fix error killing the stats observable',
      category: 'RxJS', difficulty: 'medium',
      file: 'features/project-detail/project-detail.component.ts',
      description: 'The getProjectStats() API randomly throws errors. When it does, the toSignal() receives the error and the stats are permanently lost. No retry or fallback.',
      hint: 'Pipe the observable through catchError(() => of({ open: 0, closed: 0, velocity: 0 })) and/or retry({ count: 3, delay: 1000 }) before passing to toSignal().',
    },

    // Tier 5: DI
    {
      number: 14, title: 'Provide missing InjectionToken (API_CONFIG)',
      category: 'DI', difficulty: 'medium',
      file: 'core/tokens/api-config.token.ts + app.config.ts',
      description: 'The NotificationService injects API_CONFIG but this token is never provided anywhere. The app crashes when NotificationService is first used.',
      hint: 'In app.config.ts, add to providers: `{ provide: API_CONFIG, useValue: { baseUrl: "/api", timeout: 5000, retryAttempts: 3 } }`. Or add a factory to the token definition itself.',
    },
    {
      number: 15, title: 'Fix multi-provider Logger injection',
      category: 'DI', difficulty: 'hard',
      file: 'core/tokens/logger.token.ts + core/services/notification.service.ts',
      description: 'We want ConsoleLogger AND RemoteLogger to both be active. But only the last provider wins because multi: true is not set. Also, the injection type must change to Logger[].',
      hint: 'Provide LOGGER twice with multi: true: `{ provide: LOGGER, useClass: ConsoleLogger, multi: true }, { provide: LOGGER, useClass: RemoteLogger, multi: true }`. In NotificationService, change to `private loggers = inject(LOGGER) as Logger[]` and iterate.',
    },

    // Tier 6: Content Projection
    {
      number: 16, title: 'Fix ng-content selector mismatch in CardComponent',
      category: 'Projection', difficulty: 'medium',
      file: 'shared/components/card/card.component.ts',
      description: 'The CardComponent uses `select="card-header"` (element selector) but the parent projects with `[card-header]` (attribute). The selectors don\'t match, so nothing renders.',
      hint: 'Align the selectors. If the parent uses <div card-header>, the select should be `select="[card-header]"` (attribute selector with brackets). Check both the card component and the projects component.',
    },
    {
      number: 17, title: 'Render ContentChild footer template',
      category: 'Projection', difficulty: 'medium',
      file: 'shared/components/card/card.component.ts',
      description: 'The @ContentChild captures a #cardFooter template but it\'s never rendered in the card\'s template. The mat-card-actions section is empty.',
      hint: 'Add `<ng-container *ngTemplateOutlet="footerTemplate"></ng-container>` inside the mat-card-actions div. This renders the captured template in the card\'s footer area.',
    },
    {
      number: 18, title: 'Fix ngTemplateOutlet context in DataTable',
      category: 'Projection', difficulty: 'hard',
      file: 'shared/components/data-table/data-table.component.ts',
      description: 'The DataTable passes `{ value: row[col.key] }` as context to ngTemplateOutlet, but the consuming template expects `$implicit` for the default let-variable and `row`/`column` for named ones.',
      hint: 'Change the context to `{ $implicit: row[col.key], row: row, column: col }`. Then in the parent template: `<ng-template #cellTemplate let-value let-row="row" let-col="column">`.',
    },

    // Tier 7: Routing
    {
      number: 19, title: 'Fix inverted auth guard logic',
      category: 'Routing', difficulty: 'easy',
      file: 'core/guards/auth.guard.ts',
      description: 'The auth guard returns false when the user IS logged in (blocking them) and true when they\'re NOT logged in (allowing access). The logic is backwards.',
      hint: 'Invert: `if (!authService.isLoggedIn()) { return router.createUrlTree(["/login"]); } return true;`',
    },
    {
      number: 20, title: 'Fix admin guard signal call',
      category: 'Routing', difficulty: 'easy',
      file: 'core/guards/admin.guard.ts',
      description: 'The admin guard checks `authService.isAdmin` (the signal reference, always truthy) instead of `authService.isAdmin()` (the signal value). Every user appears to be admin.',
      hint: 'Add () to call the signal: `authService.isAdmin()`. A signal reference is always truthy; you must call it to get the boolean value.',
    },
    {
      number: 21, title: 'Fix resolver reading wrong route param',
      category: 'Routing', difficulty: 'medium',
      file: 'core/guards/project.resolver.ts',
      description: 'The resolver reads `route.paramMap.get("id")` but the route config uses `:projectId`. The resolver always gets null and the API call fails.',
      hint: 'Change `get("id")` to `get("projectId")` to match the route parameter name in app.routes.ts.',
    },
    {
      number: 22, title: 'Fix lazy-loaded route with NgModule component',
      category: 'Routing', difficulty: 'medium',
      file: 'app.routes.ts',
      description: 'The settings route tries to lazy-load SettingsComponent, but SettingsComponent is declared in an NgModule (not standalone). Lazy loading with loadComponent only works with standalone components.',
      hint: 'Either convert SettingsComponent to standalone (recommended), or use loadChildren with the NgModule approach: `loadChildren: () => import("...").then(m => m.SettingsModule)` with child routes.',
    },
  ];

  getChallengesByTier(categories: string[]): Challenge[] {
    return this.challenges.filter(c => categories.includes(c.category));
  }
}
