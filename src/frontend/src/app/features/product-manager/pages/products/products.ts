import { Component, inject, DestroyRef, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { StatusChip } from '../../components/status-chip/status-chip';
import { MainButton } from '../../../../shared/components/main-button/main-button';
import { PencilButton } from '../../components/pencil-button/pencil-button';
import { TrashButton } from '../../../../shared/components/trash-button/trash-button';

import { ImageUrlPipe } from '../../../../core/pipes/image-url.pipe';
import { ProductService } from '../../../../core/services/product-manager/product.service';
import { ToastService } from '../../../../core/services/common/toast.service';
import {
  AdminProductListItemDto,
<<<<<<< HEAD
  ProductTabCountsDto,
} from '../../../../core/models/product.models';
import { ProductStatus } from '../../../../core/constants/product-status';
=======
  ProductStatus,
  ProductTabCountsDto,
} from '../../../../core/models/base/product.models';
>>>>>>> main

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
    StatusChip,
    MainButton,
    PencilButton,
    TrashButton,
    ImageUrlPipe,
    MatProgressSpinnerModule,
  ],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  private productService = inject(ProductService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);

  private productsSub?: Subscription;

  displayedColumns: string[] = ['photo', 'name', 'status', 'date', 'actions'];
  dataSource: AdminProductListItemDto[] = [];

  totalCount = 0;
  pageSize = 6;
  pageIndex = 0;

  currentStatus?: ProductStatus;

  counts: ProductTabCountsDto = { total: 0, published: 0, drafts: 0 };

  ProductStatus = ProductStatus;
  isLoading = true;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.productsSub?.unsubscribe();

    this.isLoading = true;

    this.productsSub = this.productService
      .getProducts(this.pageIndex + 1, this.pageSize, this.currentStatus)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          const countsArray = response.counts ?? [];

          const totalItem = countsArray.find((item: any) => item.key === 'Total');
          const publishedItem = countsArray.find((item: any) => item.key === 'Published');
          const draftsItem = countsArray.find((item: any) => item.key === 'Drafts');

          this.counts = {
            total: totalItem?.count ?? 0,
            published: publishedItem?.count ?? 0,
            drafts: draftsItem?.count ?? 0,
          };

          const tableData = response.tableData;
          this.dataSource = tableData?.items ?? [];
          this.totalCount = tableData?.totalCount ?? 0;

          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.toastService.showError('Помилка при завантаженні списку товарів');
          console.error(err);
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  onTabChange(event: MatTabChangeEvent) {
    if (event.index === 0) {
      this.currentStatus = undefined;
    } else if (event.index === 1) {
      this.currentStatus = ProductStatus.Published;
    } else if (event.index === 2) {
      this.currentStatus = ProductStatus.Draft;
    }

    this.pageIndex = 0;

    this.dataSource = [];
    this.loadProducts();
  }

  navigateToAdd() {
    this.router.navigate(['/product-manager/add-products']);
  }

  navigateToEdit(id: string) {
    this.router.navigate(['/product-manager/edit-products', id]);
  }

  deleteProduct(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: {
        title: 'Видалення товару',
        message: 'Ви впевнені, що хочете назавжди видалити цей товар?',
        confirmText: 'Видалити',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productService
          .deleteProduct(id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.toastService.showSuccess('Товар успішно видалено');
              this.loadProducts();
            },
            error: () => this.toastService.showError('Не вдалося видалити товар'),
          });
      }
    });
  }
}
