import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService, UserProfile } from '../../auth/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatSnackBarModule,
    CommonModule
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.showError('Veuillez entrer un email valide et un mot de passe d’au moins 5 caractères.');
      return;
    }
    const credentials = this.loginForm.value;
    this.authService.login(credentials).subscribe({
      next: (profile: UserProfile) => {
        this.showSuccess(`Bienvenue, ${profile.firstname} !`);
      },
      error: (err) => {
        const message = err.error?.error?.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.';
        this.showError(message);
      }
    });
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, '✔️', {
      duration: 3000,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, '❌', {
      duration: 4000,
      panelClass: ['snackbar-error'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}