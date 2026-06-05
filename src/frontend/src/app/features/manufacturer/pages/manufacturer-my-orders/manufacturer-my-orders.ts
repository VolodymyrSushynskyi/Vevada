import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OrderSummaryDto } from '../../../../core/models/order.models';
import { OrderStatus } from '../../../../core/constants/order-status';
import { ManufacturerOrderCard } from '../../components/manufacturer-order-card/manufacturer-order-card';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { OrderDetails } from '../../../client/components/order-details/order-details';

@Component({
  selector: 'app-manufacturer-my-orders',
  imports: [CommonModule, ManufacturerOrderCard, MatDialogModule],
  templateUrl: './manufacturer-my-orders.html',
  styleUrl: './manufacturer-my-orders.css',
})
export class ManufacturerMyOrders {
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);

  public myOrders: Array<OrderSummaryDto & { clientCancellationRequested?: boolean }> = [
    {
      id: 'guid-1',
      orderNumber: '1028',
      createdAt: new Date('2026-05-28T10:00:00').toISOString(),
      totalAmount: 3000,
      itemsCount: 3,
      mainImageUrl: '',
      status: OrderStatus.Accepted,
      statusMessage: '',
      clientCancellationRequested: false,
    },
    {
      id: 'guid-2',
      orderNumber: '1029',
      createdAt: new Date('2026-03-05T23:00:00').toISOString(),
      totalAmount: 1500,
      itemsCount: 1,
      mainImageUrl: '',
      status: OrderStatus.Manufacturing,
      statusMessage: '',
      clientCancellationRequested: true,
    },
  ];

  onStatusChange(event: { orderId: string; newStatus: OrderStatus }): void {
    console.log(`Оновлення статусу для ${event.orderId} на ${event.newStatus}`);

    const orderIndex = this.myOrders.findIndex((o) => o.id === event.orderId);

    if (orderIndex !== -1) {
      this.myOrders[orderIndex] = {
        ...this.myOrders[orderIndex],
        status: event.newStatus,
      };
    }
  }

  onViewDetails(orderNumber: string): void {
    const mockOrderItems = [
      {
        id: 'item-1',
        productName: 'Костюм зі смужками з боку',
        mainImageUrl:
          'https://api.vevada.uk/content/images/358b8141-66af-42ba-aaf5-2d4270cd0feb-thumb.webp',
        price: 3020,
        sizeLabel: '160',
        quantity: 2,
      },
      {
        id: 'item-2',
        productName: 'Костюм з діагональними смужками',
        mainImageUrl:
          'https://api.vevada.uk/content/images/07208ac1-0e48-4de0-ab3e-1edd2a683f3a-thumb.webp',
        price: 1099,
        sizeLabel: '152',
        quantity: 1,
      },
      {
        id: 'item-3',
        productName: 'Костюм з горизонтальними смужками',
        mainImageUrl:
          'https://api.vevada.uk/content/images/b405ee3a-6e5e-43d5-8f0c-cff481a2f0e8-thumb.webp',
        price: 2000,
        sizeLabel: '134',
        quantity: 1,
      },
    ];

    this.dialog.open(OrderDetails, {
      width: '600px',
      data: { orderNumber, items: mockOrderItems },
    });
  }

  onRefuseOrder(orderId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: {
        title: 'Відмова від замовлення',
        message:
          'Ви впевнені, що хочете відмовитись від цього замовлення? Воно повернеться у загальний список замовлень.',
        confirmText: 'Так, відмовитись',
        cancelText: 'Ні, залишити',
      },
    });

    dialogRef.afterClosed().subscribe((isConfirmed) => {
      if (isConfirmed) {
        this.myOrders = this.myOrders.filter((order) => order.id !== orderId);
        this.cdr.markForCheck();
      }
    });
  }

  onCancelOrder(orderId: string): void {
    this.myOrders = this.myOrders.filter((order) => order.id !== orderId);
  }
}
