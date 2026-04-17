import { Component, input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [MatTooltipModule],
  template: `
    <div class="avatar" [matTooltip]="name()" [style.width.px]="size()" [style.height.px]="size()">
      {{ initial() }}
    </div>
  `,
  styles: [`
    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: #7c4dff;
      color: white;
      font-weight: 500;
      font-size: 14px;
      cursor: default;
    }
  `]
})
export class UserAvatarComponent {
  name = input('Unknown');
  initial = input('?');
  size = input(32);
}
