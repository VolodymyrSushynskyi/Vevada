import { Component, Inject, OnInit, inject, DestroyRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { CloseButton } from '../../../../shared/components/close-button/close-button';
import { CatalogService } from '../../../../core/services/client/catalog.service';
import { ProductDetailsDto } from '../../../../core/models/catalog-product.models';
import { ProductSize } from '../../../../core/constants/product-size';

@Component({
  selector: 'app-size-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    CloseButton,
  ],
  templateUrl: './size-selector.html',
  styleUrl: './size-selector.css',
})
export class SizeSelector implements OnInit {
  private catalogService = inject(CatalogService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  constructor(
    public dialogRef: MatDialogRef<SizeSelector>,
    @Inject(MAT_DIALOG_DATA) public data: { productId: string },
  ) {}

  productDetails: ProductDetailsDto | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.fetchProductDetails();
  }

  fetchProductDetails(): void {
    this.catalogService
      .getProductById(this.data.productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.productDetails = response.data || response;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Помилка завантаження деталей товару', err);
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  onSizeSelected(size: ProductSize): void {
    this.dialogRef.close({
      productId: this.data.productId,
      size: size,
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
