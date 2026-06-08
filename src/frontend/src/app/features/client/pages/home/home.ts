import {
  Component,
  OnInit,
  inject,
  DestroyRef,
  PLATFORM_ID,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { SizeSelector } from '../../components/size-selector/size-selector';
import { CatalogGrid } from '../../components/catalog-grid/catalog-grid';
import { CatalogService } from '../../../../core/services/client/catalog.service';
import { CatalogProductDto } from '../../../../core/models/catalog-product.models';
import { ToastService } from '../../../../core/services/common/toast.service';

import { FavoritesService } from '../../../../core/services/client/favorites.service';
import { SessionService } from '../../../../core/services/auth/session.service';
import { CartService } from '../../../../core/services/client/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CatalogGrid, MatPaginatorModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private catalogService = inject(CatalogService);
  private cartService = inject(CartService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private toastService = inject(ToastService);
  private platformId = inject(PLATFORM_ID);
  private dialog = inject(MatDialog);
  private favoritesService = inject(FavoritesService);
  private sessionService = inject(SessionService);
  private router = inject(Router);

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
      .pipe(
        switchMap((catalogResponse) => {
          if (this.sessionService.isAuthenticated()) {
            return this.favoritesService.getFavorites().pipe(
              map((favorites) => ({ catalogResponse, favorites })),
              // Добавляем перехват ошибки конкретно для избранного!
              catchError((err) => {
                console.warn(
                  'Не вдалося завантажити обране (можливо, ендпоінт ще не готовий)',
                  err,
                );
                // Возвращаем пустой массив избранного, чтобы каталог загрузился
                return of({ catalogResponse, favorites: [] });
              }),
            );
          }
          return of({ catalogResponse, favorites: [] });
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: ({ catalogResponse, favorites }) => {
          const favoriteIds = new Set(favorites.map((f) => f.productId));

          this.products = catalogResponse.items.map((product) => ({
            ...product,
            isFavorite: favoriteIds.has(product.id),
          }));

          this.totalRecords = catalogResponse.totalCount;
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
        this.cartService
          .addItem({
            productId: result.productId,
            size: result.size,
            quantity: 1,
          })
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.toastService.showSuccess('Товар додано до кошика!');
            },
            error: (err) => {
              console.error(err);
              this.toastService.showError('Помилка при додаванні в кошик');
            },
          });
      }
    });
  }

  handleToggleFavorite(product: CatalogProductDto): void {
    if (!this.sessionService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    product.isFavorite = !product.isFavorite;
    this.cdr.markForCheck();

    this.favoritesService
      .toggleFavorite(product.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (err) => {
          product.isFavorite = !product.isFavorite;
          this.toastService.showError('Помилка при оновленні обраного');
          this.cdr.markForCheck();
        },
      });
  }
}
