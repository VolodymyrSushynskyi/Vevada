import {
  Component,
  OnInit,
  inject,
  DestroyRef,
  PLATFORM_ID,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { OrdersService } from '../../../../core/services/client/orders.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HorizontalProductCard } from '../../components/horizontal-product-card/horizontal-product-card';
import { QuantityStepper } from '../../components/quantity-stepper/quantity-stepper';
import { OrderSummary } from '../../components/order-summary/order-summary';
import { TrashButton } from '../../../../shared/components/trash-button/trash-button';
import { CartService } from '../../../../core/services/client/cart.service';
import { CartItemDto } from '../../../../core/models/cart.models';
import { ToastService } from '../../../../core/services/common/toast.service';
import { ImageUrlPipe } from '../../../../core/pipes/image-url.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    HorizontalProductCard,
    QuantityStepper,
    OrderSummary,
    TrashButton,
    ImageUrlPipe,
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private ordersService = inject(OrdersService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  cartId: number | null = null;
  cartItems: CartItemDto[] = [];
  isLoading = true;
  isSubmitting = false;

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.cartService
      .getCart()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (cart) => {
          this.cartId = cart.cartId;
          this.cartItems = cart.items;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error(err);
          this.toastService.showError('Помилка при завантаженні кошика');
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  get totalPrice(): number {
    return this.cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  }

  onQuantityChange(cartItemId: number, newQuantity: number): void {
    const item = this.cartItems.find((i) => i.cartItemId === cartItemId);
    if (!item) return;

    const previousQuantity = item.quantity;

    item.quantity = newQuantity;
    this.cdr.markForCheck();

    this.cartService
      .updateQuantity(cartItemId, newQuantity)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: () => {
          item.quantity = previousQuantity;
          this.toastService.showError('Не вдалося оновити кількість');
          this.cdr.markForCheck();
        },
      });
  }

  onRemoveItem(cartItemId: number): void {
    const previousItems = [...this.cartItems];

    this.cartItems = this.cartItems.filter((item) => item.cartItemId !== cartItemId);
    this.cdr.markForCheck();

    this.cartService
      .removeItem(cartItemId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: () => {
          this.cartItems = previousItems;
          this.toastService.showError('Не вдалося видалити товар');
          this.cdr.markForCheck();
        },
      });
  }

  onCheckout(): void {
    this.isSubmitting = true;
    this.cdr.markForCheck();

    this.ordersService
      .placeOrder()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Замовлення успішно оформлено!');
          this.router.navigate(['/profile/orders']);
        },
        error: (err) => {
          console.error(err);
          this.toastService.showError('Помилка при оформленні замовлення');
          this.isSubmitting = false;
          this.cdr.markForCheck();
        },
      });
  }
}
