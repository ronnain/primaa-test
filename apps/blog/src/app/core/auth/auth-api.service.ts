import { Injectable, inject } from '@angular/core';
import { BlogApi } from '../api/blog-api';
import { CreateAccount, LoginAccount } from '@primaa/blog-types';
import { from, map } from 'rxjs';
import { EmailAlreadyExistsError } from './email-already-exists.error';
import { AccountNotFoundError } from './account-not-found.error';

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

  login(loginAccount: LoginAccount) {
    return from(
      this.blogApi.auth.login({
        body: loginAccount,
      })
    ).pipe(
      map((data) => {
        if (data.status === 200) {
          return data.body;
        }
        if (data.status === 404) {
          throw new AccountNotFoundError();
        }
        throw new Error('Unknown error'); // TODO TEST
      })
    );
  }
}
