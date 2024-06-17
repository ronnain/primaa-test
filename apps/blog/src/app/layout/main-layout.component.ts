import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GlobalMenuComponent } from '../pattern/global.menu.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  template: `
    <div class="h-mainPageHeight">
      <router-outlet />
    </div>
    <div class="h-bottomActionsBar">
      <app-global-menu />
    </div>
  `,
  imports: [RouterModule, GlobalMenuComponent],
})
export class MainLayoutComponent {}
