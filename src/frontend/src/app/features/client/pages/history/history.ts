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

import { HistoryOrderCard } from '../../components/history-order-card/history-order-card';
import { SubButton } from '../../../../shared/components/sub-button/sub-button';
import { OrderDetails } from '../../components/order-details/order-details';
import { OrderDto } from '../../../../core/models/order.models';
import { OrdersService } from '../../../../core/services/client/orders.service';
import { ToastService } from '../../../../core/services/common/toast.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, HistoryOrderCard, SubButton, MatProgressSpinnerModule],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class History implements OnInit {
  private ordersService = inject(OrdersService);
  private toastService = inject(ToastService);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  historyOrders: OrderDto[] = [];
  visibleCount = 4;
  isLoading = true;

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.ordersService
      .getOrderHistory()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (orders) => {
          this.historyOrders = orders;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error(err);
          this.toastService.showError('Помилка завантаження історії');
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  get displayedOrders() {
    return this.historyOrders.slice(0, this.visibleCount);
  }

  get hasMoreOrders(): boolean {
    return this.historyOrders.length > this.visibleCount;
  }

  loadMore(): void {
    this.visibleCount += 4;
  }

  handleViewDetails(orderId: number): void {
    const order = this.historyOrders.find((o) => o.orderId === orderId);
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
