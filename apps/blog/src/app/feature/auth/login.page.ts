import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { blogApi } from '../../core/api/blog-api';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule],
  template: `LoginPage`,
})
export default class LoginPageComponent {
  private readonly blogApi = inject(blogApi);

  constructor() {
    this.blogApi.auth
      .login({
        body: { email: 'test@gmail.com', password: 'password' },
      })
      .subscribe();

    this.blogApi.auth.login({
      body: { email: 'test@gmail.com', password: 'password' },
    });
  }
}
