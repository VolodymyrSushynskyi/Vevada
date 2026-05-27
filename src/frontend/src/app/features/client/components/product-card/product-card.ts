import { Component, Input, Output, EventEmitter, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CartButton } from '../cart-button/cart-button';
import { FavoriteButton } from '../favorite-button/favorite-button';

export interface ProductCardDto {
  id: string;
  title: string;
  price: number;
  thumbnailUrl: string;
  isFavorite: boolean;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, FavoriteButton, CartButton, MatIconModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input({ required: true }) product!: ProductCardDto;
  @Output() addToCart = new EventEmitter<ProductCardDto>();
  @Output() toggleFavorite = new EventEmitter<ProductCardDto>();

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
