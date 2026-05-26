import { Component, EventEmitter, Input, Output, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { UiCard } from '../ui-card/ui-card';
import { ImageUploader } from '../image-uploader/image-uploader';
import { MainButton } from '../../../../shared/components/main-button/main-button';
import { BackButton } from '../../../../shared/components/back-button/back-button';

import {
  ProductFormRules,
  newProductLineValidator,
} from '../../../../core/validators/product-manager/product-form.validator';
import {
  VALIDATION_MESSAGES,
  VALIDATION_PRIORITY,
} from '../../../../core/constants/validation-messages';

@Component({
  selector: 'app-product-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    UiCard,
    ImageUploader,
    MainButton,
    BackButton,
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm {
  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  @Input() pageTitle: string = 'Додати товар';

  @Input() set initialData(data: any) {
    if (data) {
      this.form.patchValue(data);
    }
  }

  @Output() formSubmit = new EventEmitter<{ formData: any; mainPhoto: File[]; gallery: File[] }>();
  @Output() goBack = new EventEmitter<void>();

  private currentMainPhoto: File[] = [];
  private currentGallery: File[] = [];

  form = new FormGroup(
    {
      productLineId: new FormControl('', ProductFormRules.productLineId),
      newProductLineName: new FormControl('', ProductFormRules.newProductLineName),
      name: new FormControl('', ProductFormRules.name),
      shortDescription: new FormControl('', ProductFormRules.shortDescription),
      fullDescription: new FormControl('', ProductFormRules.fullDescription),
      price: new FormControl<number | null>(null, ProductFormRules.price),
      sizes: new FormControl<string[]>([], ProductFormRules.sizes),
      status: new FormControl('draft', ProductFormRules.status),
      mainPhoto: new FormControl<File[]>([], ProductFormRules.mainPhoto),
    },
    { validators: newProductLineValidator },
  );

  get selectedSizes(): string[] {
    return this.form.get('sizes')?.value || [];
  }

  removeSize(sizeToRemove: string) {
    const currentSizes = this.selectedSizes;
    const newSizes = currentSizes.filter((size) => size !== sizeToRemove);
    this.form.get('sizes')?.setValue(newSizes);
  }

  onMainPhotoChanged(files: File[]) {
    this.currentMainPhoto = files;
    this.form.get('mainPhoto')?.setValue(files);
    this.form.get('mainPhoto')?.markAsTouched();
  }

  onGalleryChanged(files: File[]) {
    this.currentGallery = files;
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    for (const errorKey of VALIDATION_PRIORITY) {
      if (control.hasError(errorKey)) {
        return VALIDATION_MESSAGES[errorKey](control.errors[errorKey]);
      }
    }

    const firstErrorKey = Object.keys(control.errors)[0];
    if (VALIDATION_MESSAGES[firstErrorKey]) {
      return VALIDATION_MESSAGES[firstErrorKey](control.errors[firstErrorKey]);
    }
    return 'Невірне значення';
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = { ...this.form.value };
      delete formData.mainPhoto;

      this.formSubmit.emit({
        formData: formData,
        mainPhoto: this.currentMainPhoto,
        gallery: this.currentGallery,
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
