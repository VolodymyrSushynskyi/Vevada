import { Component, inject } from '@angular/core';
import { OrderCard } from '../../components/order-card/order-card';
import { OrderSummaryDto } from '../../../../core/models/order.models';
import { OrderStatus } from '../../../../core/constants/order-status';
import { MatDialog } from '@angular/material/dialog';
import { OrderDetails } from '../../components/order-details/order-details';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [OrderCard],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  mockOrders: OrderSummaryDto[] = [
    {
      id: 'guid-1',
      orderNumber: '10096',
      createdAt: new Date('2026-08-28T10:00:00'),
      totalAmount: 9139,
      itemsCount: 3,
      mainImageUrl: '/img/pink-leotard1.jpg',
      status: OrderStatus.Pending,
      statusMessage: 'Ваше замовлення чекає підтвердження',
    },
    {
      id: 'guid-2',
      orderNumber: '10094',
      createdAt: new Date('2026-08-20T09:15:00'),
      totalAmount: 2198,
      itemsCount: 2,
      mainImageUrl: '/img/pink-leotard2.jpg',
      status: OrderStatus.Cancelled,
      statusMessage: 'Ваше замовлення скасовано',
    },
  ];

  private dialog = inject(MatDialog);

  handleCancelOrder(orderId: string) {
    console.log('Отменяем заказ:', orderId);
  }

  handleViewDetails(orderId: string) {
    const order = this.mockOrders.find((o) => o.id === orderId);
    if (!order) return;

    const mockItems = [
      {
        id: '1',
        productName: 'Костюм зі смужками з боку',
        sizeLabel: '160',
        price: 3020,
        quantity: 2,
        mainImageUrl: '/img/pink-leotard1.jpg',
      },
      {
        id: '2',
        productName: 'Костюм з діагональними смужками',
        sizeLabel: '152',
        price: 1099,
        quantity: 1,
        mainImageUrl: '/img/pink-leotard2.jpg',
      },
      {
        id: '3',
        productName: 'Костюм з горизонтальними смужками',
        sizeLabel: '134',
        price: 2000,
        quantity: 1,
        mainImageUrl: '/img/blue-leotard.jpg',
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
