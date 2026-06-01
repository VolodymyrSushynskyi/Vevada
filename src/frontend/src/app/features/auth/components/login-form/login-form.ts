import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MainButton } from '../../../../shared/components/main-button/main-button';
import { UiInput } from '../../../../shared/components/ui-input/ui-input';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { SessionService } from '../../../../core/services/auth/session.service';
import { ToastService } from '../../../../core/services/common/toast.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MainButton, UiInput],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private sessionService = inject(SessionService);
  private router = inject(Router);

  isSubmitting = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;

      const credentials = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!,
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.sessionService.startSession(response);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toastService.showError(err.error?.message || 'Виникла помилка при вході');
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
