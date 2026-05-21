import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

export function passwordComplexityValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  if (
    !/[a-z]/.test(value) ||
    !/[A-Z]/.test(value) ||
    !/[0-9]/.test(value) ||
    !/[^a-zA-Z0-9]/.test(value)
  ) {
    return { passwordComplexity: true };
  }

  return null;
}

export const RegisterClientRules = {
  firstName: [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
  lastName: [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
  phoneNumber: [Validators.required, Validators.minLength(7), Validators.maxLength(20)],
  email: [Validators.required, Validators.email],
  password: [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(255),
    passwordComplexityValidator,
  ],
};
