import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { AccountAuthStore } from '../core/auth/account-auth.store';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-global-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  template: ` <nav
    class="flex items-center justify-between bg-tertiary-80 p-4 h-bottomActionsBar"
  >
    <button mat-icon-button (click)="onLogout()">
      <mat-icon>logout</mat-icon>
    </button>
    <button
      mat-icon-button
      routerLink="/articles/edit"
      routerLinkActive="!bg-tertiary-70"
    >
      <mat-icon>post_add</mat-icon>
    </button>
    <button
      mat-icon-button
      routerLink="/articles"
      routerLinkActive="!bg-tertiary-70"
      [routerLinkActiveOptions]="{ exact: true }"
    >
      <mat-icon>home</mat-icon>
    </button>
  </nav>`,
})
export class GlobalMenuComponent {
  private readonly router = inject(Router);
  private readonly accountAuthStore = inject(AccountAuthStore);

  constructor() {
    effect(() => {
      if (!this.accountAuthStore.isAuthenticated()) {
        this.router.navigate(['/login']);
      }
    });
  }

  protected onLogout() {
    this.accountAuthStore.logout();
  }
}
