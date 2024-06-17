import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AccountAuthStore } from '../core/auth/account-auth.store';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-global-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: ` <nav class="flex items-center justify-between bg-primary p-4">
    <a class="text-white" routerLink="/">Home</a>
  </nav>`,
})
export class GlobalMenuComponent {
  private readonly accountAuthStore = inject(AccountAuthStore);
}
