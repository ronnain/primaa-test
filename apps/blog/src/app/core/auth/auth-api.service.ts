import { Injectable, inject } from '@angular/core';
import { BlogApi } from '../api/blog-api';
import { CreateAccount } from '@primaa/blog-types';
import { from, map } from 'rxjs';
import { EmailAlreadyExistsError } from './email-already-exists.error';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly blogApi = inject(BlogApi);

  createAccount(accountToCreate: CreateAccount) {
    return from(
      this.blogApi.auth.createAccount({
        body: accountToCreate,
      })
    ).pipe(
      map((data) => {
        if (data.status === 201) {
          return data.body;
        }
        if (data.status === 409) {
          throw new EmailAlreadyExistsError();
        }
        throw new Error('Unknown error'); // TODO TEST
      })
    );
  }
}
