import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BlogApi } from '../../core/api/blog-api';
import { from } from 'rxjs';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule],
  template: `LoginPage`,
})
export default class LoginPageComponent {
  private readonly BlogApi = inject(BlogApi);

  constructor() {
    from(
      this.BlogApi.auth.login({
        body: { email: 'test@gmail.com', password: 'password' },
      })
    ).subscribe();

    this.BlogApi.auth.login({
      body: { email: 'test@gmail.com', password: 'password' },
    });
  }
}
