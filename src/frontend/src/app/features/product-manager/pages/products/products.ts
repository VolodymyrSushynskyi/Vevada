import { Component, inject, DestroyRef, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { StatusChip } from '../../components/status-chip/status-chip';
import { MainButton } from '../../../../shared/components/main-button/main-button';
import { PencilButton } from '../../components/pencil-button/pencil-button';
import { TrashButton } from '../../../../shared/components/trash-button/trash-button';

import { ImageUrlPipe } from '../../../../core/pipes/image-url.pipe';
import { ProductService } from '../../../../core/services/product-manager/product.service';
import { ToastService } from '../../../../core/services/common/toast.service';
import {
  AdminProductListItemDto,
  ProductStatus,
  ProductTabCountsDto,
} from '../../../../core/models/base/product.models';

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

  private productsSub?: Subscription;

  displayedColumns: string[] = ['photo', 'name', 'status', 'date', 'actions'];
  dataSource: AdminProductListItemDto[] = [];

  totalCount = 0;
  pageSize = 6;
  pageIndex = 0;

  currentStatus?: ProductStatus;

  counts: ProductTabCountsDto = { total: 0, published: 0, drafts: 0 };

  ProductStatus = ProductStatus;

  ngOnInit() {
    setTimeout(() => {
      this.loadProducts();
    });
  }

  loadProducts() {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.productsSub) {
      this.productsSub.unsubscribe();
    }

    this.productsSub = this.productService
      .getProducts(this.pageIndex + 1, this.pageSize, this.currentStatus)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          setTimeout(() => {
            this.counts = {
              total: response.counts?.total ?? response.counts?.Total ?? 0,
              published: response.counts?.published ?? response.counts?.Published ?? 0,
              drafts: response.counts?.drafts ?? response.counts?.Drafts ?? 0,
            };

            const tableData = response.tableData ?? response.TableData;
            this.dataSource = tableData?.data ?? tableData?.Data ?? tableData?.items ?? [];
            this.totalCount = tableData?.totalCount ?? tableData?.TotalCount ?? 0;

            this.cdr.detectChanges();
          });
        },
        error: (err) => {
          this.toastService.showError('Помилка при завантаженні списку товарів');
          console.error(err);
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

    setTimeout(() => {
      this.dataSource = [];
      this.loadProducts();
    });
  }

  navigateToAdd() {
    this.router.navigate(['/product-manager/add-products']);
  }

  navigateToEdit(id: string) {
    this.router.navigate(['/product-manager/edit-products', id]);
  }

  deleteProduct(id: string) {
    if (confirm('Ви впевнені, що хочете видалити цей товар?')) {
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
  }
}
