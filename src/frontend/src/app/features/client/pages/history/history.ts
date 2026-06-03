import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HistoryOrderCard } from '../../components/history-order-card/history-order-card';
import { SubButton } from '../../../../shared/components/sub-button/sub-button';
import { OrderDetails } from '../../components/order-details/order-details';
import { OrderSummaryDto } from '../../../../core/models/order.models';
import { OrderStatus } from '../../../../core/constants/order-status';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [HistoryOrderCard, SubButton],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class History {
  private dialog = inject(MatDialog);

  visibleCount = 4;

  mockHistoryOrders: OrderSummaryDto[] = [
    {
      id: 'h1',
      orderNumber: '10096',
      createdAt: '2026-08-28',
      totalAmount: 1200,
      itemsCount: 1,
      mainImageUrl: '/img/pink-leotard1.jpg',
      status: OrderStatus.Cancelled,
      statusMessage: 'Скасовано',
    },
    {
      id: 'h2',
      orderNumber: '10095',
      createdAt: '2026-08-25',
      totalAmount: 56083,
      itemsCount: 6,
      mainImageUrl: '/img/pink-leotard2.jpg',
      status: OrderStatus.Completed,
      statusMessage: 'Доставлено',
    },
    {
      id: 'h3',
      orderNumber: '10094',
      createdAt: '2026-03-02',
      totalAmount: 2400,
      itemsCount: 1,
      mainImageUrl: '/img/leopard-leotard.jpg',
      status: OrderStatus.Completed,
      statusMessage: 'Доставлено',
    },
    {
      id: 'h4',
      orderNumber: '10093',
      createdAt: '2026-02-27',
      totalAmount: 2000,
      itemsCount: 1,
      mainImageUrl: '/img/blue-leotard.jpg',
      status: OrderStatus.Completed,
      statusMessage: 'Доставлено',
    },
    {
      id: 'h5',
      orderNumber: '10092',
      createdAt: '2026-02-16',
      totalAmount: 1099,
      itemsCount: 1,
      mainImageUrl: '/img/pink-leotard2.jpg',
      status: OrderStatus.Completed,
      statusMessage: 'Доставлено',
    },
  ];

  get displayedOrders() {
    return this.mockHistoryOrders.slice(0, this.visibleCount);
  }

  get hasMoreOrders(): boolean {
    return this.mockHistoryOrders.length > this.visibleCount;
  }

  loadMore() {
    this.visibleCount += 4;
  }

  handleViewDetails(orderId: string) {
    const order = this.mockHistoryOrders.find((o) => o.id === orderId);
    if (!order) return;

    const mockItems = [
      {
        id: '1',
        productName: 'Костюм із смужками з боку',
        sizeLabel: '98',
        price: 1200,
        quantity: 1,
        mainImageUrl: '/img/pink-leotard1.jpg',
      },
    ];

    this.dialog.open(OrderDetails, {
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'custom-dialog-container',
      data: {
        orderNumber: order.orderNumber,
        items: mockItems,
      },
    });
  }
}
