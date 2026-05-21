import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MainButton } from '../../../../shared/components/main-button/main-button';
import { UiIconButton } from '../../../../shared/components/ui-icon-button/ui-icon-button';
import { UiInput } from '../../../../shared/components/ui-input/ui-input';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { RegisterClientRules } from '../../../../core/validators/client/register-client';
import { passwordMatchValidator } from '../../../../core/validators/client/password-match';
import { SessionService } from '../../../../core/services/auth/session.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MainButton, UiIconButton, UiInput],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  currentStep = 1;

  private authService = inject(AuthService);
  private sessionService = inject(SessionService);
  private router = inject(Router);

  registerForm = new FormGroup(
    {
      firstName: new FormControl('', RegisterClientRules.firstName),
      lastName: new FormControl('', RegisterClientRules.lastName),
      phoneNumber: new FormControl('', RegisterClientRules.phoneNumber),
      email: new FormControl('', RegisterClientRules.email),
      password: new FormControl('', RegisterClientRules.password),
      confirmPassword: new FormControl('', RegisterClientRules.password),
    },
    { validators: passwordMatchValidator },
  );

  nextStep(): void {
    const step1Controls = ['firstName', 'lastName', 'phoneNumber'];
    let isStep1Valid = true;

    step1Controls.forEach((controlName) => {
      const control = this.registerForm.get(controlName);
      if (control?.invalid) {
        control.markAsTouched();
        isStep1Valid = false;
      }
    });

    if (isStep1Valid) {
      this.currentStep = 2;
    }
  }

  prevStep(): void {
    this.currentStep = 1;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const userData = {
        firstName: this.registerForm.value.firstName!,
        lastName: this.registerForm.value.lastName!,
        phoneNumber: this.registerForm.value.phoneNumber!,
        email: this.registerForm.value.email!,
        password: this.registerForm.value.password!,
      };

      this.authService.register(userData).subscribe({
        next: (response) => {
          this.sessionService.startSession(response);
          this.router.navigate(['/']);
        },
        error: (err) => {},
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
