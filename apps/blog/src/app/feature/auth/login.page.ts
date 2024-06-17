import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  CreateAccount,
  CreateAccountSchema,
  LoginAccount,
  LoginAccountSchema,
  Role,
  Roles,
} from '@primaa/blog-types';
import { ReplaySubject, map, shareReplay, switchMap } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { AccountAuthStore } from '../../core/auth/account-auth.store';
import { EmailAlreadyExistsError } from '../../core/auth/email-already-exists.error';
import { AccountNotFoundError } from '../../core/auth/account-not-found.error';

@Component({
  selector: 'app-account-creation-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    RouterModule,
  ],
  template: `
    <div class="container h-screen flex-col flex items-center justify-center">
      <h1 class="text-3xl text-primary font-bold mb-8">Se connecter</h1>

      <form
        [formGroup]="accountLoginForm"
        (ngSubmit)="onLogin(accountLoginForm)"
      >
        <div class="w-full flex items-center justify-center flex-col gap-2">
          <mat-form-field class="w-full">
            <mat-label>Email</mat-label>
            <input
              matInput
              placeholder="Ex. romain@primaa.fr"
              formControlName="email"
              autocomplete="email"
              type="email"
            />
            <mat-icon matPrefix>alternate_email</mat-icon>
            <!-- TODO check if account already exist -->
          </mat-form-field>
          <mat-form-field class="w-full">
            <mat-label>Mot de passe</mat-label>
            <input
              matInput
              placeholder="Ex. nuggets!25"
              formControlName="password"
              autocomplete="current-password"
              #passWord
              type="password"
            />
            <mat-icon matPrefix>lock</mat-icon>
            <mat-icon
              matSuffix
              (click)="
                passWord.type =
                  passWord.type === 'password' ? 'text' : 'password'
              "
              >remove_red_eye</mat-icon
            >
          </mat-form-field>
        </div>
        <div class="w-full flex justify-end">
          <button mat-stroked-button color="accent">Valider</button>
        </div>
        <div class="">
          <a [routerLink]="'/register'">Créer son sompte</a>
        </div>

        @if($isLoading()) {
        <div class="text-primary">Connexion en cours...</div>
        } @if ($accountLoginFailed()) {
        <div class="text-red-500">
          {{ $accountLoginFailed() }}
        </div>
        }
      </form>
    </div>
  `,
})
export default class LoginPageComponent {
  // todo button go to registration page
  // todo add guard login page or go to the home page
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly accountAuthStore = inject(AccountAuthStore);

  private readonly accountToLogin$ = new ReplaySubject<LoginAccount>();

  private readonly accountCreation$ = this.accountToLogin$.pipe(
    switchMap((loginAccount) => {
      return this.accountAuthStore.login(loginAccount);
    }),
    shareReplay(1)
  );

  protected readonly $accountLoginFailed = toSignal(
    this.accountCreation$.pipe(
      map((accountCreation) => {
        if (accountCreation.error instanceof AccountNotFoundError) {
          return "L'email ou ne mot de passe n'est pas correcte";
        }
        if (accountCreation.hasError) {
          return "Un erreur s'est produite lors de la connexion à votre compte.";
        }
        return null;
      })
    ),
    {
      initialValue: null,
    }
  );

  protected readonly $isLoading = this.accountAuthStore.isLoading;

  protected roles = Roles;

  protected accountLoginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor() {
    effect(() => {
      const userAuth = this.accountAuthStore;
      if (userAuth.isAuthenticated()) {
        this.router.navigate(['articles']);
      }
    });
  }

  onLogin(form: typeof this.accountLoginForm) {
    if (form.invalid) {
      return;
    }
    const loginAccount = LoginAccountSchema.safeParse(form.value);
    if (!loginAccount.success) {
      console.error(loginAccount.error.errors);
      return;
    }
    this.accountToLogin$.next(loginAccount.data);
  }
}
