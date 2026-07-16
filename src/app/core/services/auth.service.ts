import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models';
import { MockDataService } from './mock-data.service';

// 🐛 CHALLENGE 5 (Signals - computed & effect):
// This service mixes BehaviorSubject (old pattern) and signals (new pattern)
// inconsistently. The `isAdmin` computed signal reads from the BehaviorSubject
// instead of the signal, so it never updates reactively.
// Also, `currentUser` signal and `currentUser$` BehaviorSubject can get out of sync.
// FIX: Pick one source of truth (signals) and derive everything from it.

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Old pattern - still used by some components
  private currentUser$ = new BehaviorSubject<User | null>(null);

  // New pattern - signal
  currentUser = signal<User | null>(null);

  // 🐛 BUG: This reads from the BehaviorSubject value, not the signal.
  // So when currentUser signal changes, this won't re-evaluate.
  isAdmin = computed(() => {
    const user = this.currentUser$.getValue();
    return user?.role === 'admin';
  });

  isLoggedIn = computed(() => this.currentUser() !== null);

  constructor(private mockData: MockDataService) {}

  login(userId: string): void {
    const user = this.mockData.getUserById(userId) ?? null;
    this.currentUser.set(user);
    // 🐛 CHALLENGE 5 BUG: forgot to also update the BehaviorSubject —
    // currentUser$ still holds the old value, so anything reading it
    // (like the isAdmin computed above) is out of sync with the signal.
  }

  logout(): void {
    this.currentUser.set(null);
    this.currentUser$.next(null);
  }

  /** @deprecated Use currentUser signal instead */
  getCurrentUser$() {
    return this.currentUser$.asObservable();
  }
}
