import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;

  if (password && confirmPassword && password !== confirmPassword) {
    form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }
  return null;
}
