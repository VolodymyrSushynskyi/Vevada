import {
  Component,
  EventEmitter,
  Input,
  Output,
  DestroyRef,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { UiCard } from '../ui-card/ui-card';
import { ImageUploader } from '../image-uploader/image-uploader';
import { MainButton } from '../../../../shared/components/main-button/main-button';
import { BackButton } from '../../../../shared/components/back-button/back-button';
import { environment } from '../../../../core/config/environment';

import {
  ProductFormRules,
  newProductLineValidator,
} from '../../../../core/validators/product-manager/product-form.validator';
import {
  VALIDATION_MESSAGES,
  VALIDATION_PRIORITY,
} from '../../../../core/constants/validation-messages';

import { ProductService } from '../../../../core/services/product-manager/product.service';

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
  private productService = inject(ProductService);

  private retainedMainPhotoId: string | null = null;
  private retainedGalleryIds: string[] = [];

  destroyRef = inject(DestroyRef);

  isBrowser = isPlatformBrowser(this.platformId);

  mainPhotoPreview: string | null = null;
  galleryPhotosPreviews: string[] = [];
  productSeries: any[] = [];

  @Input() pageTitle: string = 'Додати товар';

  @Input() initialData: any = null;

  @Output() formSubmit = new EventEmitter<{
    formData: any;
    mainPhoto: File[];
    gallery: File[];
    retainedMainPhotoId: string | null;
    retainedGalleryIds: string[];
  }>();
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

    if (files.length > 0 || this.retainedMainPhotoId) {
      this.form.get('mainPhoto')?.clearValidators();
    } else {
      this.form.get('mainPhoto')?.setValidators(ProductFormRules.mainPhoto);
    }
    this.form.get('mainPhoto')?.updateValueAndValidity();
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

  ngOnInit() {
    if (this.initialData) {
      this.form.patchValue(this.initialData);

      this.retainedMainPhotoId = this.initialData.mainImageId || null;
      this.retainedGalleryIds = this.initialData.galleryImageIds || [];

      if (this.initialData.mainImageId) {
        this.form.get('mainPhoto')?.clearValidators();
        this.form.get('mainPhoto')?.updateValueAndValidity();
      }

      const baseUrl = environment.apiUrl.replace(/\/api$/, '');
      if (this.initialData.mainImageId) {
        this.mainPhotoPreview = `${baseUrl}/content/images/${this.initialData.mainImageId}-thumb.webp`;
      }
      if (this.initialData.galleryImageIds && this.initialData.galleryImageIds.length > 0) {
        this.galleryPhotosPreviews = this.initialData.galleryImageIds.map(
          (imageId: string) => `${baseUrl}/content/images/${imageId}-thumb.webp`,
        );
      }
    }

    this.productService
      .getSeriesLookup()
      .pipe(takeUntilDestroyed(this.destroyRef)) // <-- Магия автоматической отписки
      .subscribe({
        next: (response: any) => {
          this.productSeries = response;

          if (this.productSeries?.length > 0) {
            if (!this.initialData) {
              const firstId = this.productSeries[0].id;
              this.form.get('productLineId')?.setValue(firstId);
            } else {
              const savedId = this.initialData.productLineId;
              if (savedId) {
                this.form.get('productLineId')?.setValue(savedId);
              }
            }
          }
        },
        error: (err) => console.error('Помилка при завантаженні лінійок', err),
      });
  }

  private extractIdFromUrl(url: string): string | null {
    const match = url.match(/\/images\/(.+?)-thumb\.webp/);
    return match ? match[1] : null;
  }

  onExistingMainPhotoChanged(urls: string[]) {
    if (urls.length === 0) {
      this.retainedMainPhotoId = null;
      // Якщо видалили старе фото і не додали нове - робимо поле невалідним
      if (this.currentMainPhoto.length === 0) {
        this.form.get('mainPhoto')?.setValidators(ProductFormRules.mainPhoto);
        this.form.get('mainPhoto')?.updateValueAndValidity();
      }
    } else {
      this.retainedMainPhotoId = this.extractIdFromUrl(urls[0]);
    }
  }

  onExistingGalleryChanged(urls: string[]) {
    this.retainedGalleryIds = urls
      .map((url) => this.extractIdFromUrl(url))
      .filter((id) => id !== null) as string[];
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = { ...this.form.value };
      delete formData.mainPhoto;

      // Відправляємо всі дані батьківському компоненту
      this.formSubmit.emit({
        formData: formData,
        mainPhoto: this.currentMainPhoto,
        gallery: this.currentGallery,
        retainedMainPhotoId: this.retainedMainPhotoId,
        retainedGalleryIds: this.retainedGalleryIds,
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
