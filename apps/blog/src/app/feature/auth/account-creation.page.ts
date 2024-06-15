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
  Role,
  Roles,
} from '@primaa/blog-types';
import { ReplaySubject, map, shareReplay, switchMap } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { UserAuthStore } from '../../core/auth/user-auth.store';
import { EmailAlreadyExistsError } from '../../core/auth/email-already-exists.error';

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
      <h1 class="text-3xl text-primary font-bold mb-8">Créer son compte</h1>

      <form
        [formGroup]="accountCreationForm"
        (ngSubmit)="onCreateAccount(accountCreationForm)"
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
              autocomplete="new-password"
              #passWord
              type="password"
            />
            <mat-hint>Minium 8 caractères</mat-hint>
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
          <mat-form-field class="w-full">
            <mat-label>Role</mat-label>
            <mat-select formControlName="role">
              @for (role of roles; track role) {
              <mat-option [value]="role">{{ role }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
        <div class="w-full flex justify-end">
          <button mat-stroked-button color="accent">Valider</button>
        </div>

        @if($isCreationLoading()) {
        <div class="text-primary">Création de votre compte en cours...</div>
        } @if ($accountCreationError()) {
        <div class="text-red-500">
          {{ $accountCreationError() }}
        </div>
        }
      </form>
    </div>
  `,
})
export default class AccountCreationPageComponent {
  // to button go to login page
  // todo add guard login page or go to the home page
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly userAuthStore = inject(UserAuthStore);

  private readonly accountToCreate$ = new ReplaySubject<CreateAccount>();

  private readonly accountCreation$ = this.accountToCreate$.pipe(
    switchMap((accountToCreate) => {
      return this.userAuthStore.createAccount(accountToCreate);
    }),
    shareReplay(1)
  );

  protected readonly $accountCreationError = toSignal(
    this.accountCreation$.pipe(
      map((accountCreation) => {
        if (accountCreation.error instanceof EmailAlreadyExistsError) {
          this.accountCreationForm.controls.email.setErrors({
            notUnique: true,
          });
          return 'Un compte existe déjà pour cet email.';
        }
        if (accountCreation.hasError) {
          return "Un erreur s'est produite lors de la création de votre compte.";
        }
        return null;
      })
    ),
    {
      initialValue: null,
    }
  );

  protected readonly $isCreationLoading = toSignal(
    this.accountCreation$.pipe(
      map((accountCreation) => accountCreation?.isLoading)
    ),
    {
      initialValue: false,
    }
  );

  protected roles = Roles;

  protected accountCreationForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: new FormControl<Role | null>(null, Validators.required),
  });

  constructor() {
    effect(() => {
      const userAuth = this.userAuthStore;
      if (userAuth.isAuthenticated()) {
        this.router.navigate(['login']); // todo change to home page
      }
    });
  }

  onCreateAccount(form: typeof this.accountCreationForm) {
    if (form.invalid) {
      return;
    }
    const accountCreation = CreateAccountSchema.safeParse(form.value);
    if (!accountCreation.success) {
      console.error(accountCreation.error.errors);
      return;
    }
    this.accountToCreate$.next(accountCreation.data);
  }
}
