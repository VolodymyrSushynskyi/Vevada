import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;

  const confirmPasswordControl = form.get('confirmPassword');
  const existingErrors = confirmPasswordControl?.errors ?? null;

  if (password && confirmPassword && password !== confirmPassword) {
    confirmPasswordControl?.setErrors({ ...existingErrors, passwordMismatch: true });
    return { passwordMismatch: true };
  }

  if (existingErrors?.['passwordMismatch']) {
    const { passwordMismatch, ...remainingErrors } = existingErrors;
    confirmPasswordControl?.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
  }

  return null;
}
