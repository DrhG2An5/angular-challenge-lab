import { Injectable, signal, effect } from '@angular/core';

// 🐛 CHALLENGE 6 (Signals - effect):
// The effect that persists the theme to localStorage creates an
// infinite loop because it both reads AND writes the signal.
// The effect reads `this.darkMode()`, then calls `this.darkMode.set()`
// which triggers the effect again → infinite loop.
// FIX: The effect should only READ the signal and write to localStorage.
// The initialization should happen outside the effect.

@Injectable({ providedIn: 'root' })
export class ThemeService {
  darkMode = signal(false);

  constructor() {
    // 🐛 BUG: This effect creates an infinite loop
    effect(() => {
      // Read the signal (creates dependency)
      const isDark = this.darkMode();

      // Persist to localStorage
      localStorage.setItem('darkMode', JSON.stringify(isDark));

      // Apply to document
      document.body.classList.toggle('dark-theme', isDark);

      // 🐛 BUG: Reading from localStorage and setting the signal
      // inside the effect that depends on the signal → infinite loop!
      const stored = localStorage.getItem('darkMode');
      if (stored !== null) {
        this.darkMode.set(JSON.parse(stored));
      }
    });
  }

  toggle(): void {
    this.darkMode.update(v => !v);
  }
}
