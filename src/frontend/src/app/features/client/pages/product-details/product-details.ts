import {
  Component,
  OnInit,
  inject,
  DestroyRef,
  PLATFORM_ID,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';

import { CatalogService } from '../../../../core/services/client/catalog.service';
import { ProductDetailsDto } from '../../../../core/models/catalog-product.models';
import { ProductInfo } from '../../components/product-info/product-info';
import { SizeSelector } from '../../components/size-selector/size-selector';
import { ToastService } from '../../../../core/services/common/toast.service';
import { ProductGallery } from '../../components/product-gallery/product-gallery';
import { SizeGuideDialog } from '../../components/size-guide/size-guide';

import { StarRating } from '../../../../shared/components/star-rating/star-rating';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, ProductInfo, ProductGallery, StarRating],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private route = inject(ActivatedRoute);
  private catalogService = inject(CatalogService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private toastService = inject(ToastService);

  product: ProductDetailsDto | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const productId = params.get('id');
      if (productId) {
        this.loadProductDetails(productId);
      }
    });
  }

  loadProductDetails(id: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.isLoading = true;
    this.product = null;
    this.cdr.markForCheck();

    this.catalogService
      .getProductById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.product = (response as any).data || response;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Помилка завантаження товару', err);
          this.toastService.showError('Не вдалося завантажити інформацію про товар');
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  onAddToCart(): void {
    if (!this.product) return;

    const dialogRef = this.dialog.open(SizeSelector, {
      width: '400px',
      data: { productId: this.product.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(`Товар ${result.productId} розмір ${result.size} додано в кошик!`);
        this.toastService.showSuccess('Товар додано до кошика!');
      }
    });
  }

  onToggleFavorite(): void {
    console.log('Додано в обране:', this.product?.name);
  }

  onOpenSizeGuide(): void {
    this.dialog.open(SizeGuideDialog, {
      width: '1100px',
      maxHeight: '95vh',
      maxWidth: '95vw',
      autoFocus: false,
    });
  }
}
