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

  form = new FormGroup({
    productLineId: new FormControl('', Validators.required),
    newProductLineName: new FormControl(''),
    name: new FormControl('', Validators.required),
    shortDescription: new FormControl(''),
    fullDescription: new FormControl(''),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    sizes: new FormControl<string[]>([], Validators.required),
    status: new FormControl('draft', Validators.required),
  });

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
  }

  onGalleryChanged(files: File[]) {
    this.currentGallery = files;
  }

  onSubmit() {
    if (this.form.valid) {
      this.formSubmit.emit({
        formData: this.form.value,
        mainPhoto: this.currentMainPhoto,
        gallery: this.currentGallery,
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
