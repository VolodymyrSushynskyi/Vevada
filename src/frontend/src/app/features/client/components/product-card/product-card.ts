import { Component, Input, Output, EventEmitter, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CartButton } from '../cart-button/cart-button';
import { FavoriteButton } from '../favorite-button/favorite-button';
import { SessionService } from '../../../../core/services/auth/session.service';

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
  @Input() product: ProductCardDto = {
    id: 'test-guid-123',
    title: 'Тестовый купальник Vevadaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    price: 1500,
    thumbnailUrl: '/img/blue-leotard.jpg',
    isFavorite: false,
  };

  @Output() addToCart = new EventEmitter<ProductCardDto>();
  @Output() toggleFavorite = new EventEmitter<ProductCardDto>();

  private router = inject(Router);
  private sessionService = inject(SessionService);

  private platformId = inject(PLATFORM_ID);
  public isBrowser = isPlatformBrowser(this.platformId);

  onFavoriteClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.sessionService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.product.isFavorite = !this.product.isFavorite;
    this.toggleFavorite.emit(this.product);
  }

  onAddToCartClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.sessionService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.addToCart.emit(this.product);
  }
}
