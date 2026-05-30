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
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

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
    console.log('Товар выбран для корзины, нужно открыть сайднав с размерами:', product.name);
  }

  handleToggleFavorite(product: CatalogProductDto): void {
    console.log('Отправка запроса на добавление в избранное:', product.name);
  }
}
