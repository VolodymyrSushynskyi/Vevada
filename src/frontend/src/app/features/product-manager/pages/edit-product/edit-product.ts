import { Component, DestroyRef, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';
import { ProductForm } from '../../components/product-form/product-form';
import { ProductService } from '../../../../core/services/product-manager/product.service';
import { ToastService } from '../../../../core/services/common/toast.service';
import { UpdateProductCommand } from '../../../../core/models/product.models';
import { ProductStatus } from '../../../../core/constants/product-status';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [ProductForm],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css',
})
export class EditProduct {
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);

  productData: any = null;

  private currentProductId!: string;
  private existingMainImageId!: string;
  private existingGalleryImageIds: string[] = [];

  isSubmitting = false;

  ngOnInit() {
    this.currentProductId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.currentProductId) {
      this.toastService.showError('Помилка: ID товару не знайдено');
      this.goBack();
      return;
    }

    this.productService
      .getProductById(this.currentProductId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (product: any) => {
          console.log('Дані товару для редагування:', product);

          this.existingMainImageId = product.mainImageId;
          this.existingGalleryImageIds = product.galleryImageIds ?? [];

          const isPublished = product.status === 1;

          this.productData = {
            productLineId: product.productSeriesId,
            name: product.name,
            shortDescription: product.shortDescription,
            fullDescription: product.fullDescription,
            price: product.price,
            status: isPublished ? 'published' : 'draft',
            sizes: product.availableSizes,
            mainImageId: this.existingMainImageId,
            galleryImageIds: this.existingGalleryImageIds,
          };

          this.cdr.detectChanges();
        },
        error: () => {
          this.toastService.showError('Не вдалося завантажити дані товару');
          this.goBack();
        },
      });
  }

  onFormSubmit(eventData: {
    formData: any;
    mainPhoto: File[];
    gallery: File[];
    retainedMainPhotoId: string | null;
    retainedGalleryIds: string[];
  }) {
    const { formData, mainPhoto, gallery, retainedMainPhotoId, retainedGalleryIds } = eventData;

    this.isSubmitting = true;

    const mainPhotoUpload$ =
      mainPhoto.length > 0
        ? this.productService.uploadImage(mainPhoto[0])
        : of(retainedMainPhotoId);

    const galleryUploads$ =
      gallery.length > 0
        ? forkJoin(gallery.map((file) => this.productService.uploadImage(file)))
        : of([]);

    forkJoin({
      mainId: mainPhotoUpload$,
      galleryIds: galleryUploads$,
    })
      .pipe(
        switchMap((imageResults) => {
          const finalGalleryIds = [...retainedGalleryIds, ...imageResults.galleryIds];

          const command: UpdateProductCommand = {
            id: this.currentProductId,
            productSeriesId: formData.productLineId === 'new' ? null : formData.productLineId,
            newSeriesName: formData.productLineId === 'new' ? formData.newProductLineName : null,
            name: formData.name,
            shortDescription: formData.shortDescription,
            fullDescription: formData.fullDescription,
            price: formData.price,
            status: formData.status === 'published' ? ProductStatus.Published : ProductStatus.Draft,
            availableSizes: formData.sizes,
            mainImageId: imageResults.mainId as string,
            galleryImageIds: finalGalleryIds,
          };

          return this.productService.updateProduct(this.currentProductId, command);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.toastService.showSuccess('Товар успішно оновлено!');
          this.router.navigate(['/product-manager/products']);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toastService.showError('Помилка при оновленні товару');
          console.error(err);
        },
      });
  }

  goBack() {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      disableClose: true,
      data: {
        title: 'Підтвердження виходу',
        message: 'Якщо ви вийдете, всі незбережені зміни будуть втрачені. Ви дійсно хочете вийти?',
        confirmText: 'Вийти',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.router.navigate(['/product-manager/products']);
    });
  }
}
