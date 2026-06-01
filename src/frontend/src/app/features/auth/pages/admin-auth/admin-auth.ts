import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MainButton } from '../../../../shared/components/main-button/main-button';
import { UiInput } from '../../../../shared/components/ui-input/ui-input';
import { BrandLogoWithText } from '../../../../shared/components/brand-logo-with-text/brand-logo-with-text';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { SessionService } from '../../../../core/services/auth/session.service';
import { ToastService } from '../../../../core/services/common/toast.service';

@Component({
  selector: 'app-admin-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BrandLogoWithText, MainButton, UiInput],
  templateUrl: './admin-auth.html',
  styleUrl: './admin-auth.css',
})
export class AdminAuth {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private sessionService = inject(SessionService);
  private router = inject(Router);

  adminAuthForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    if (this.adminAuthForm.valid) {
      const credentials = {
        email: this.adminAuthForm.value.email!,
        password: this.adminAuthForm.value.password!,
      };

      this.authService.loginAdmin(credentials).subscribe({
        next: (response) => {
          this.sessionService.startSession(response);
          this.navigateByRole(response.role);
        },
        error: (err) => {
          this.toastService.showError(err.error?.message || 'Виникла помилка при вході');
        },
      });
    } else {
      this.adminAuthForm.markAllAsTouched();
    }
  }

  private navigateByRole(role: string) {
    switch (role) {
      case 'SuperAdmin':
        this.router.navigate(['/super-admin']);
        break;
      case 'Analyst':
        this.router.navigate(['/analyst']);
        break;
      case 'ProductManager':
        this.router.navigate(['/product-manager']);
        break;
      case 'Manufacturer':
        this.router.navigate(['/manufacturer']);
        break;
      default:
        console.warn('Невідома роль:', role);
        this.router.navigate(['/']);
        break;
    }
  }
}
