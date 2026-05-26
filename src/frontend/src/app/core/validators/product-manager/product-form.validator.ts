import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

export function newProductLineValidator(group: AbstractControl): ValidationErrors | null {
  const lineId = group.get('productLineId')?.value;
  const newNameControl = group.get('newProductLineName');
  const existingErrors = newNameControl?.errors ?? {};

  if (lineId === 'new' && (!newNameControl?.value || newNameControl.value.trim() === '')) {
    newNameControl?.setErrors({ ...existingErrors, requiredLineName: true });
    return { requiredLineName: true };
  }

  if (existingErrors?.['requiredLineName']) {
    const { requiredLineName, ...remainingErrors } = existingErrors;
    newNameControl?.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
  }

  return null;
}

export const ProductFormRules = {
  productLineId: [Validators.required],
  newProductLineName: [Validators.maxLength(150)],
  name: [Validators.required, Validators.maxLength(150)],
  shortDescription: [Validators.maxLength(500)],
  fullDescription: [Validators.maxLength(1500)],
  price: [Validators.required, Validators.min(0.01)],
  sizes: [Validators.required],
  status: [Validators.required],
  mainPhoto: [Validators.required],
};
