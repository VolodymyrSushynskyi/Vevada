import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';

import { HorizontalProductCard } from '../../components/horizontal-product-card/horizontal-product-card';
import { QuantityStepper } from '../../components/quantity-stepper/quantity-stepper';
import { OrderSummary } from '../../components/order-summary/order-summary';
import { TrashButton } from '../../../../shared/components/trash-button/trash-button';

export interface CartItemDto {
  cartItemId: string;
  productId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    HorizontalProductCard,
    QuantityStepper,
    OrderSummary,
    TrashButton,
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  isSubmitting = false;

  cartItems: CartItemDto[] = [
    {
      cartItemId: 'cart-item-1',
      productId: 'prod-1',
      name: 'Костюм зі смужками з боку',
      size: '160',
      price: 3020,
      quantity: 2,
      imageUrl: '/img/pink-leotard1.jpg',
    },
    {
      cartItemId: 'cart-item-2',
      productId: 'prod-1',
      name: 'Костюм з діагональними смужками',
      size: '152',
      price: 1099,
      quantity: 1,
      imageUrl: '/img/pink-leotard2.jpg',
    },
    {
      cartItemId: 'cart-item-3',
      productId: 'prod-2',
      name: 'Костюм з горизонтальними смужками',
      size: '134',
      price: 2000,
      quantity: 1,
      imageUrl: '/img/blue-leotard.jpg',
    },
  ];

  // Динамический подсчет общей суммы
  get totalPrice(): number {
    return this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  // Обновление количества товара
  onQuantityChange(cartItemId: string, newQuantity: number): void {
    const item = this.cartItems.find((i) => i.cartItemId === cartItemId);
    if (item) {
      item.quantity = newQuantity;
      // В будущем здесь будет вызов API: this.cartService.updateQuantity(...)
    }
  }

  // Удаление товара из корзины
  onRemoveItem(cartItemId: string): void {
    this.cartItems = this.cartItems.filter((item) => item.cartItemId !== cartItemId);
    // В будущем здесь будет вызов API: this.cartService.removeItem(...)
  }

  // Оформление заказа
  onCheckout(): void {
    this.isSubmitting = true;
    console.log('Оформлення замовлення...', this.cartItems);

    // Имитация задержки сервера
    setTimeout(() => {
      this.isSubmitting = false;
      alert('Перехід до сторінки оплати/оформлення');
    }, 1500);
  }
}
