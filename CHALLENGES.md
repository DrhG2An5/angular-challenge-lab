# BugTracker Pro — Angular Challenge Lab

A project management app with **22 intentional bugs** organized across 7 tiers of difficulty. Find the 🐛 comments in the code, understand the problem, and fix it.

## How to Use

```bash
npm start        # Start the dev server
```

Navigate to **http://localhost:4200** — you'll land on the dashboard. Use the sidebar "Challenges" link to see the full challenge list with hints.

Every bug is marked with `🐛 CHALLENGE N` in the source code. Each challenge teaches a specific Angular concept.

---

## Tier 1: Standalone & Modern Syntax (Easy)

### Challenge 1 — Convert @Input() to input() signals
**File:** `shared/components/challenge-hint/challenge-hint.component.ts`
**Problem:** Uses old `@Input()` decorator pattern
**Learn:** Signal-based inputs (`input()`, `input.required<T>()`)

### Challenge 2 — Convert *ngIf/*ngFor to @if/@for
**File:** `features/dashboard/dashboard.component.ts`
**Problem:** Uses old structural directives mixed with new syntax
**Learn:** Built-in control flow (`@if`, `@for` with `track`, `@switch`, `@empty`)

### Challenge 3 — Signal input not called as function
**File:** `shared/components/status-badge/status-badge.component.ts`
**Problem:** `this.status` (signal reference) vs `this.status()` (signal value) in computed()
**Learn:** Signal inputs must be called to read their value

---

## Tier 2: Signals & Reactivity (Medium)

### Challenge 4 — signal() vs computed() for derived state
**File:** `features/dashboard/dashboard.component.ts`
**Problem:** `recentIssues = signal(this.allIssues().slice(0, 5))` captures value once, never updates
**Learn:** `signal()` = static value, `computed()` = reactive derivation

### Challenge 5 — BehaviorSubject ↔ Signal sync in AuthService
**File:** `core/services/auth.service.ts`
**Problem:** `isAdmin` computed reads from BehaviorSubject (not signal), and the two sources get out of sync
**Learn:** Pick one reactivity primitive; `computed()` must read other signals

### Challenge 6 — Infinite loop in effect()
**File:** `core/services/theme.service.ts`
**Problem:** Effect reads signal → writes to localStorage → reads localStorage → sets signal → triggers effect again
**Learn:** Effects should not write to their own dependencies

---

## Tier 3: NgRx State Management (Medium-Hard)

### Challenge 7 — Understanding NgRx data flow
**File:** `store/projects/projects.selectors.ts`
**Problem:** Trace why `selectSelectedProject` returns null
**Learn:** NgRx data flow: Component → Action → Reducer → Selector

### Challenge 8 — State mutation with push()
**File:** `store/projects/projects.reducer.ts`
**Problem:** `state.projects.push(project)` mutates state; `return state` returns same reference
**Learn:** NgRx requires immutable updates with spread operator

### Challenge 9 — Nested state mutation
**File:** `store/projects/projects.reducer.ts`
**Problem:** `find()` + direct mutation of nested object; shallow spread doesn't help
**Learn:** Deep immutability with `map()` to replace nested objects

### Challenge 10 — Effect with dispatch: false
**File:** `store/projects/projects.effects.ts`
**Problem:** `createProject$` maps to success/failure actions but `{ dispatch: false }` prevents dispatching
**Learn:** `dispatch: false` = side-effect only (no action dispatched back)

---

## Tier 4: RxJS Patterns (Easy-Medium)

### Challenge 11 — Memory leak from unsubscribed interval
**File:** `layout/shell.component.ts`
**Problem:** `interval(1000).subscribe()` never unsubscribed
**Learn:** `takeUntilDestroyed()`, `DestroyRef`, or manual unsubscribe in ngOnDestroy

### Challenge 11b — Multiple subscription leaks
**File:** `features/issues/issues.component.ts`
**Problem:** Two subscriptions (search$ and store) never cleaned up
**Learn:** Managing subscription lifecycle

### Challenge 12 — Race condition with mergeMap
**File:** `store/issues/issues.effects.ts`
**Problem:** `mergeMap` on search → old slow results can arrive after new fast ones
**Learn:** `switchMap` cancels previous inner observable

### Challenge 13 — Error kills the stats observable
**File:** `features/project-detail/project-detail.component.ts`
**Problem:** Flaky API throws, `toSignal()` dies permanently, no recovery
**Learn:** `catchError()` with fallback, `retry()` operator

---

## Tier 5: Dependency Injection (Medium-Hard)

### Challenge 14 — Missing InjectionToken provider
**File:** `core/tokens/api-config.token.ts` + `app.config.ts`
**Problem:** `API_CONFIG` token defined but never provided; NotificationService crashes
**Learn:** `InjectionToken`, `provide` + `useValue/useFactory`

### Challenge 15 — Multi-provider Logger
**File:** `core/tokens/logger.token.ts` + `app.config.ts`
**Problem:** Two LOGGER providers without `multi: true` — last one wins
**Learn:** `multi: true` for collecting multiple implementations

---

## Tier 6: Content Projection (Medium-Hard)

### Challenge 16 — ng-content selector mismatch
**File:** `shared/components/card/card.component.ts`
**Problem:** Card uses `select="card-header"` (element) but parent uses `[card-header]` (attribute)
**Learn:** CSS selector syntax in ng-content: `[attr]` vs `element`

### Challenge 17 — ContentChild template not rendered
**File:** `shared/components/card/card.component.ts`
**Problem:** `@ContentChild('cardFooter')` captures template but never renders it with `ngTemplateOutlet`
**Learn:** `@ContentChild` + `*ngTemplateOutlet` pattern

### Challenge 18 — ngTemplateOutlet context mismatch
**File:** `shared/components/data-table/data-table.component.ts`
**Problem:** Context `{ value: ... }` but template expects `$implicit`, `row`, `column`
**Learn:** Template outlet context: `$implicit` for default let-variable

---

## Tier 7: Routing (Easy-Medium)

### Challenge 19 — Inverted auth guard logic
**File:** `core/guards/auth.guard.ts`
**Problem:** Guard blocks logged-in users and allows anonymous access (logic backwards)
**Learn:** Functional guards (`CanActivateFn`), `router.createUrlTree()` for redirect

### Challenge 20 — Signal not called in admin guard
**File:** `core/guards/admin.guard.ts`
**Problem:** `authService.isAdmin` (signal reference, always truthy) vs `authService.isAdmin()` (value)
**Learn:** Signal references are objects (truthy); must call to get value

### Challenge 21 — Resolver reads wrong route param
**File:** `core/guards/project.resolver.ts`
**Problem:** `route.paramMap.get('id')` but route config uses `:projectId`
**Learn:** Route params must match between config and resolver

### Challenge 22 — Lazy loading non-standalone component
**File:** `app.routes.ts` + `features/settings/settings.component.ts`
**Problem:** `loadComponent` only works with standalone components
**Learn:** `loadComponent` vs `loadChildren` for standalone vs NgModule

---

## Tips

- Look for 🐛 in the source code — every challenge is annotated
- The **Challenges** page in the app (sidebar) has collapsible hints
- Start from Tier 1 and work down — earlier tiers unlock understanding for later ones
- Use Angular DevTools browser extension to inspect signals and state
- Use Redux DevTools to inspect NgRx store actions and state
