import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';
import { ProductForm } from '../../components/product-form/product-form';
import { ProductService } from '../../../../core/services/product-manager/product.service';
import { ToastService } from '../../../../core/services/common/toast.service';
import { CreateProductCommand, ProductStatus } from '../../../../core/models/base/product.models';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ProductForm],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProduct {
  private productService = inject(ProductService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  onFormSubmit(eventData: { formData: any; mainPhoto: File[]; gallery: File[] }) {
    const { formData, mainPhoto, gallery } = eventData;

    if (!mainPhoto || mainPhoto.length === 0) {
      console.error("Головне фото обов'язкове!");
      return;
    }

    this.productService
      .uploadImage(mainPhoto[0])
      .pipe(
        switchMap((mainImageId: string) => {
          const galleryUploads$ =
            gallery.length > 0
              ? forkJoin(gallery.map((file) => this.productService.uploadImage(file)))
              : of([]);

          return forkJoin({
            mainId: of(mainImageId),
            galleryIds: galleryUploads$,
          });
        }),
        switchMap((imageResults) => {
          const command: CreateProductCommand = {
            productSeriesId: formData.productLineId === 'new' ? null : formData.productLineId,
            newSeriesName: formData.productLineId === 'new' ? formData.newProductLineName : null,

            name: formData.name,
            shortDescription: formData.shortDescription,
            fullDescription: formData.fullDescription,
            price: formData.price,

            status: formData.status === 'published' ? ProductStatus.Published : ProductStatus.Draft,
            availableSizes: formData.sizes,

            mainImageId: imageResults.mainId,
            galleryImageIds: imageResults.galleryIds,
          };
          return this.productService.createProduct(command);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (resultId) => {
          this.router.navigate(['/product-manager/products']);
        },
        error: (err) => {
          this.toastService.showError('Помилка при створенні товару');
        },
      });
  }

  goBack() {
    this.router.navigate(['/product-manager/products']);
  }
}
