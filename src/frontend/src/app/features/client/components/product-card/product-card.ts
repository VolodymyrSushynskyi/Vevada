import { Component, Input, Output, EventEmitter, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CartButton } from '../cart-button/cart-button';
import { FavoriteButton } from '../favorite-button/favorite-button';
import { CatalogProductDto } from '../../../../core/models/catalog-product.models';
import { ImageUrlPipe } from '../../../../core/pipes/image-url.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, FavoriteButton, CartButton, MatIconModule, ImageUrlPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input({ required: true }) product!: CatalogProductDto;
  @Output() addToCart = new EventEmitter<CatalogProductDto>();
  @Output() toggleFavorite = new EventEmitter<CatalogProductDto>();

  private platformId = inject(PLATFORM_ID);
  public isBrowser = isPlatformBrowser(this.platformId);

  onFavoriteClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.toggleFavorite.emit(this.product);
  }

  onAddToCartClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }
}
