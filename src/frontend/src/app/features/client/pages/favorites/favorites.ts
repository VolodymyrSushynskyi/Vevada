import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';

import { HorizontalProductCard } from '../../components/horizontal-product-card/horizontal-product-card';
import { FavoriteButton } from '../../components/favorite-button/favorite-button';
import { UiIconButton } from '../../../../shared/components/ui-icon-button/ui-icon-button';

export interface FavoriteItemDto {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
}

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, MatDividerModule, HorizontalProductCard, FavoriteButton, UiIconButton],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites {
  favoriteItems: FavoriteItemDto[] = [
    {
      productId: 'prod-1',
      name: 'Костюм з діагональними смужками',
      price: 1099,
      imageUrl: '/img/pink-leotard2.jpg',
    },
    {
      productId: 'prod-2',
      name: 'Костюм зі смужками з боку',
      price: 3020,
      imageUrl: '/img/snake-leotard.jpg',
    },
  ];

  onRemoveFromFavorites(productId: string): void {
    this.favoriteItems = this.favoriteItems.filter((item) => item.productId !== productId);
  }

  onAddToCart(productId: string): void {
    console.log(`Додано в кошик товар з ID: ${productId}`);
  }
}
