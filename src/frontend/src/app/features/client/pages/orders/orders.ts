import {
  Component,
  OnInit,
  inject,
  DestroyRef,
  ChangeDetectorRef,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { OrderCard } from '../../components/order-card/order-card';
import { OrderDetails } from '../../components/order-details/order-details';
import { OrderDto } from '../../../../core/models/order.models';
import { OrdersService } from '../../../../core/services/client/orders.service';
import { ToastService } from '../../../../core/services/common/toast.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, OrderCard, MatProgressSpinnerModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  private ordersService = inject(OrdersService);
  private toastService = inject(ToastService);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  activeOrders: OrderDto[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.ordersService
      .getActiveOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (orders) => {
          this.activeOrders = orders;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error(err);
          this.toastService.showError('Помилка завантаження замовлень');
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  handleCancelOrder(orderId: number): void {
    const order = this.activeOrders.find((o) => o.orderId === orderId);
    if (!order) return;

    order.cancellationRequested = true;
    this.cdr.markForCheck();

    this.ordersService
      .requestCancellation(orderId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Запит на скасування відправлено');
        },
        error: () => {
          // Відкат у разі помилки
          order.cancellationRequested = false;
          this.toastService.showError('Не вдалося відправити запит');
          this.cdr.markForCheck();
        },
      });
  }

  handleViewDetails(orderId: number): void {
    const order = this.activeOrders.find((o) => o.orderId === orderId);
    if (!order) return;

    this.dialog.open(OrderDetails, {
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'custom-dialog-container',
      data: {
        orderNumber: order.orderId.toString(),
        items: order.items,
      },
    });
  }
}
