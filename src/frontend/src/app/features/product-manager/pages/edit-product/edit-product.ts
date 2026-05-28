import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';
import { ProductForm } from '../../components/product-form/product-form';
import { ProductService } from '../../../../core/services/product-manager/product.service';
import { ToastService } from '../../../../core/services/common/toast.service';
import { UpdateProductCommand, ProductStatus } from '../../../../core/models/base/product.models';

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
  private route = inject(ActivatedRoute); // Для получения ID из URL
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  // Сюда мы положим данные, чтобы передать их в <app-product-form [initialData]="productData">
  productData: any = null;

  // Сохраняем текущие данные, чтобы использовать их, если пользователь не менял фото
  private currentProductId!: string;
  private existingMainImageId!: string;
  private existingGalleryImageIds: string[] = [];

  ngOnInit() {
    // 1. Берем ID товара из адресной строки (например, /product-manager/products/edit/3fa85f64...)
    this.currentProductId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.currentProductId) {
      this.toastService.showError('Помилка: ID товару не знайдено');
      this.goBack();
      return;
    }

    // 2. Загружаем данные товара с бекенда
    this.productService
      .getProductById(this.currentProductId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (product) => {
          // Запоминаем старые ID картинок
          this.existingMainImageId = product.mainImageId;
          this.existingGalleryImageIds = product.galleryImageIds;

          // Мапим данные бекенда в формат формы
          this.productData = {
            productLineId: product.productSeriesId || 'new', // Тут зависит от логики твоего UI
            name: product.name,
            shortDescription: product.shortDescription,
            fullDescription: product.fullDescription,
            price: product.price,
            status: product.status === ProductStatus.Published ? 'published' : 'draft',
            sizes: product.availableSizes,
            // mainPhoto и gallery мы не мапим напрямую в File[], так как это старые картинки
          };
        },
        error: () => {
          this.toastService.showError('Не вдалося завантажити дані товару');
          this.goBack();
        },
      });
  }

  onFormSubmit(eventData: { formData: any; mainPhoto: File[]; gallery: File[] }) {
    const { formData, mainPhoto, gallery } = eventData;

    // 3. Если пользователь добавил НОВОЕ фото — грузим его.
    // Если массив пустой — берем СТАРЫЙ ID (this.existingMainImageId).
    const mainPhotoUpload$ =
      mainPhoto.length > 0
        ? this.productService.uploadImage(mainPhoto[0])
        : of(this.existingMainImageId);

    // То же самое для галереи
    const galleryUploads$ =
      gallery.length > 0
        ? forkJoin(gallery.map((file) => this.productService.uploadImage(file)))
        : of(this.existingGalleryImageIds);

    // Запускаем процесс
    forkJoin({
      mainId: mainPhotoUpload$,
      galleryIds: galleryUploads$,
    })
      .pipe(
        switchMap((imageResults) => {
          // 4. Формируем команду UPDATE
          const command: UpdateProductCommand = {
            id: this.currentProductId, // Обязательно передаем ID

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

          return this.productService.updateProduct(this.currentProductId, command);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Товар успішно оновлено!');
          this.router.navigate(['/product-manager/products']);
        },
        error: (err) => {
          this.toastService.showError('Помилка при оновленні товару');
          console.error(err);
        },
      });
  }

  goBack() {
    this.router.navigate(['/product-manager/products']);
  }
}
