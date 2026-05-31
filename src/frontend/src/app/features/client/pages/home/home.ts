import {
  Component,
  OnInit,
  inject,
  DestroyRef,
  PLATFORM_ID,
  ChangeDetectorRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { SizeSelector } from '../../components/size-selector/size-selector';
import { CatalogGrid } from '../../components/catalog-grid/catalog-grid';
import { CatalogService } from '../../../../core/services/client/catalog.service';
import { CatalogProductDto } from '../../../../core/models/catalog-product.models';
import { ToastService } from '../../../../core/services/common/toast.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CatalogGrid, MatPaginatorModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private catalogService = inject(CatalogService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private toastService = inject(ToastService);
  private platformId = inject(PLATFORM_ID);
  private dialog = inject(MatDialog);

  products: CatalogProductDto[] = [];
  isLoading = true;

  totalRecords = 0;
  pageSize = 9;
  pageIndex = 0;

  ngOnInit(): void {
    this.loadCatalogData();
  }

  loadCatalogData(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.isLoading = true;
    this.cdr.detectChanges();

    const apiPageNumber = this.pageIndex + 1;

    this.catalogService
      .getCatalog(apiPageNumber, this.pageSize)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.products = response.items;
          this.totalRecords = response.totalCount;

          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.toastService.showError('Помилка при завантаженні каталогу');
          console.error(err);
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCatalogData();
  }

  handleAddToCart(product: CatalogProductDto): void {
    const dialogRef = this.dialog.open(SizeSelector, {
      width: '400px',
      data: { productId: product.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(`Товар ${result.productId} з розміром ${result.size} відправлено в кошик!`);
        this.toastService.showSuccess('Товар додано до кошика!');
      }
    });
  }

  handleToggleFavorite(product: CatalogProductDto): void {
    console.log('Отправка запроса на добавление в избранное:', product.name);
  }
}
