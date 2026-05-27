import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductCard } from '../../components/product-card/product-card';
import { SessionService } from '../../../../core/services/auth/session.service';

export interface ProductCardDto {
  id: string;
  title: string;
  price: number;
  thumbnailUrl: string;
  isFavorite: boolean;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  mockProduct = {
    id: '123',
    title: 'Тестовый купальник',
    price: 1500,
    thumbnailUrl: '/img/blue-leotard.jpg',
    isFavorite: false,
  };

  private router = inject(Router);
  private sessionService = inject(SessionService);

  handleFavoriteClick(clickedProduct: ProductCardDto) {
    // 1. Проверяем авторизацию
    if (!this.sessionService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.mockProduct = {
      ...this.mockProduct,
      isFavorite: !this.mockProduct.isFavorite,
    };
  }

  handleAddToCart(clickedProduct: ProductCardDto) {
    if (!this.sessionService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    console.log('Товар добавлен в корзину:', clickedProduct);
  }
}
