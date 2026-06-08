import {
  Component,
  OnInit,
  inject,
  DestroyRef,
  PLATFORM_ID,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HorizontalProductCard } from '../../components/horizontal-product-card/horizontal-product-card';
import { FavoriteButton } from '../../components/favorite-button/favorite-button';
import { UiIconButton } from '../../../../shared/components/ui-icon-button/ui-icon-button';
import { FavoritesService } from '../../../../core/services/client/favorites.service';
import { ToastService } from '../../../../core/services/common/toast.service';
import { FavoriteItemDto } from '../../../../core/models/favorite-item.models';
import { ImageUrlPipe } from '../../../../core/pipes/image-url.pipe';
import { SizeSelector } from '../../components/size-selector/size-selector';
import { CartService } from '../../../../core/services/client/cart.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    HorizontalProductCard,
    FavoriteButton,
    UiIconButton,
    ImageUrlPipe,
  ],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites implements OnInit {
  private favoritesService = inject(FavoritesService);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);
  private dialog = inject(MatDialog);
  private cartService = inject(CartService);

  favoriteItems: FavoriteItemDto[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.isLoading = true;
    this.cdr.detectChanges();

    this.favoritesService
      .getFavorites()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.favoriteItems = items;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error(err);
          this.toastService.showError('Помилка при завантаженні списку обраного');
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  onRemoveFromFavorites(productId: string): void {
    const previousItems = [...this.favoriteItems];

    this.favoriteItems = this.favoriteItems.filter((item) => item.productId !== productId);
    this.cdr.markForCheck();

    this.favoritesService
      .toggleFavorite(productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (err) => {
          console.error(err);
          this.toastService.showError('Не вдалося видалити товар з обраного');

          this.favoriteItems = previousItems;
          this.cdr.markForCheck();
        },
      });
  }

  onAddToCart(productId: string): void {
    const dialogRef = this.dialog.open(SizeSelector, {
      width: '400px',
      data: { productId: productId },
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
}
