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

  readonly availableSizes = [
    { id: 98, label: '98 (2-3 р.)' },
    { id: 110, label: '110 (4-5 р.)' },
    { id: 116, label: '116 (5-6 р.)' },
    { id: 122, label: '122 (6-7 р.)' },
    { id: 128, label: '128 (7-8 р.)' },
    { id: 134, label: '134 (8-9 р.)' },
    { id: 140, label: '140 (9-10 р.)' },
    { id: 146, label: '146 (10-11 р.)' },
    { id: 152, label: '152 (11-12 р.)' },
    { id: 160, label: '160 (12-13 р.)' },
    { id: 168, label: '168 (13-14 р.)' },
  ];

  form = new FormGroup(
    {
      productLineId: new FormControl('', ProductFormRules.productLineId),
      newProductLineName: new FormControl('', ProductFormRules.newProductLineName),
      name: new FormControl('', ProductFormRules.name),
      shortDescription: new FormControl('', ProductFormRules.shortDescription),
      fullDescription: new FormControl('', ProductFormRules.fullDescription),
      price: new FormControl<number | null>(null, ProductFormRules.price),
      sizes: new FormControl<number[]>([], ProductFormRules.sizes),
      status: new FormControl('draft', ProductFormRules.status),
      mainPhoto: new FormControl<File[]>([], ProductFormRules.mainPhoto),
    },
    { validators: newProductLineValidator },
  );

  get selectedSizes(): number[] {
    return this.form.get('sizes')?.value || [];
  }

  getSizeLabel(sizeId: number): string {
    const size = this.availableSizes.find((s) => s.id === sizeId);
    return size ? size.label : '';
  }

  removeSize(sizeIdToRemove: number) {
    const currentSizes = this.selectedSizes;
    const newSizes = currentSizes.filter((id) => id !== sizeIdToRemove);
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
