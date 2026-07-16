import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App {
  // Instantiated at the root so the theme applies on every route
  // (not only once the shell has injected it).
  private themeService = inject(ThemeService);
}
